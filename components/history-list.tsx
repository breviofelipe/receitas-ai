"use client"

import { useState } from "react"
import { ChevronDown, Clock, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RecipeView } from "@/components/recipe-view"
import type { HistoryItem } from "@/app/actions/recipes"

export function HistoryList({ items }: { items: HistoryItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          <History className="size-6" />
        </div>
        <h2 className="font-semibold">Nenhuma receita ainda</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Gere sua primeira receita no painel e ela aparecerá aqui no histórico.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id} className="overflow-hidden rounded-xl border bg-card">
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{item.title}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {formatDate(item.createdAt)}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.ingredients.slice(0, 6).map((ing) => (
                    <Badge key={ing} variant="secondary" className="text-xs">
                      {ing}
                    </Badge>
                  ))}
                  {item.ingredients.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.ingredients.length - 6}
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronDown
                className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="border-t p-4">
                <RecipeView title={item.title} content={item.content} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}
