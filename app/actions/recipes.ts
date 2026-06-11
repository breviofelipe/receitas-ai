"use server"

import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/mongodb"
import { createClient } from "@/lib/supabase/server"
import type { RecipeHistory } from "@/lib/types"
import { sendMessageToDeepSeek } from "@/lib/deepseek"

const GEMINI_MODEL = "gemini-2.0-flash"

async function getUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export type HistoryItem = {
  id: string
  title: string
  ingredients: string[]
  content: string
  createdAt: string
}

export async function getHistory(): Promise<HistoryItem[]> {
  const userId = await getUserId()
  if (!userId) return []

  const db = await getDb()
  const docs = await db
    .collection<RecipeHistory>("recipes")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map((d) => ({
    id: String(d._id),
    title: d.title,
    ingredients: d.ingredients ?? [],
    content: d.content,
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date(d.createdAt)).toISOString(),
  }))
}

export type GenerateResult =
  | { ok: true; id: string; title: string; content: string }
  | { ok: false; error: string }

function extractTitle(content: string, fallback: string): string {
  const firstLine = content
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0)
  if (!firstLine) return fallback
  return firstLine.replace(/^#+\s*/, "").replace(/\*\*/g, "").slice(0, 120)
}

export async function generateRecipe(ingredients: string[]): Promise<GenerateResult> {
  const userId = await getUserId()
  if (!userId) return { ok: false, error: "Não autenticado." }

  if (!ingredients.length) {
    return { ok: false, error: "Selecione pelo menos um ingrediente." }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { ok: false, error: "A chave da API do Gemini não está configurada." }
  }

  const prompt = `Você é um chef de cozinha experiente. Crie UMA receita deliciosa e prática usando principalmente os seguintes ingredientes: ${ingredients.join(", ")}.

Você pode assumir que itens básicos de cozinha (sal, água, óleo) estão disponíveis, mas priorize os ingredientes listados.

Responda em português do Brasil, em formato Markdown, seguindo exatamente esta estrutura:
# [Nome criativo da receita]

**Tempo de preparo:** [tempo]
**Porções:** [número]

## Ingredientes
- [lista com quantidades]

## Modo de preparo
1. [passo a passo numerado]

## Dica do chef
[uma dica curta]`

  let content = ""
  try {
    const res = await sendMessageToDeepSeek(prompt);
    // if (!res.ok) {
    //   const errText = await res.text()
    //   console.log("[v0] Gemini error:", res.status, errText)
    //   return { ok: false, error: "Não foi possível gerar a receita. Tente novamente." }
    // }

    // const data = await res.json()
    content = res
  } catch (err) {
    console.log("[v0] Gemini fetch failed:", err)
    return { ok: false, error: "Erro ao conectar com a IA. Tente novamente." }
  }

  if (!content.trim()) {
    return { ok: false, error: "A IA não retornou uma receita. Tente novamente." }
  }

  const title = extractTitle(content, "Receita")

  const db = await getDb()
  const result = await db.collection<RecipeHistory>("recipes").insertOne({
    userId,
    title,
    ingredients,
    content,
    createdAt: new Date(),
  })

  revalidatePath("/historico")

  return { ok: true, id: String(result.insertedId), title, content }
}
