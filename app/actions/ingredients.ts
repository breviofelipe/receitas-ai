"use server"

import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/mongodb"
import { createClient } from "@/lib/supabase/server"
import { DEFAULT_INGREDIENTS, type Ingredient } from "@/lib/types"

async function getUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export type IngredientItem = {
  id: string
  name: string
  category: string
  isCustom: boolean
}

export async function getIngredients(): Promise<IngredientItem[]> {
  const userId = await getUserId()
  if (!userId) return []

  const db = await getDb()
  const custom = await db
    .collection<Ingredient>("ingredients")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()

  const defaults: IngredientItem[] = DEFAULT_INGREDIENTS.map((ing) => ({
    id: `default:${ing.name}`,
    name: ing.name,
    category: ing.category,
    isCustom: false,
  }))

  const customItems: IngredientItem[] = custom.map((ing) => ({
    id: String(ing._id),
    name: ing.name,
    category: ing.category || "Personalizados",
    isCustom: true,
  }))

  return [...customItems, ...defaults]
}

export async function addIngredient(formData: FormData): Promise<{ error?: string }> {
  const userId = await getUserId()
  if (!userId) return { error: "Não autenticado." }

  const name = String(formData.get("name") || "").trim()
  const category = String(formData.get("category") || "Personalizados").trim()

  if (!name) return { error: "Informe o nome do ingrediente." }

  const db = await getDb()
  const collection = db.collection<Ingredient>("ingredients")

  const existing = await collection.findOne({
    userId,
    name: { $regex: `^${name}$`, $options: "i" },
  })
  if (existing) return { error: "Você já cadastrou esse ingrediente." }

  await collection.insertOne({
    name,
    category: category || "Personalizados",
    userId,
    createdAt: new Date(),
  })

  revalidatePath("/dashboard")
  return {}
}
