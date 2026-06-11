"use client"

import { useMemo, useState, useTransition } from "react"
import { Plus, Sparkles, Loader2, Search, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { addIngredient, type IngredientItem } from "@/app/actions/ingredients"
import { generateRecipe } from "@/app/actions/recipes"
import { RecipeView } from "@/components/recipe-view"

export function DashboardClient({ initialIngredients }: { initialIngredients: IngredientItem[] }) {
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [adding, startAdding] = useTransition()
  const [generating, setGenerating] = useState(false)
  const [recipe, setRecipe] = useState<{ title: string; content: string } | null>(null)

  const grouped = useMemo(() => {
    const filtered = ingredients.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()),
    )
    const map = new Map<string, IngredientItem[]>()
    for (const ing of filtered) {
      const list = map.get(ing.category) ?? []
      list.push(ing)
      map.set(ing.category, list)
    }
    return Array.from(map.entries())
  }, [ingredients, search])

  const selectedNames = useMemo(
    () => ingredients.filter((i) => selected.has(i.id)).map((i) => i.name),
    [ingredients, selected],
  )

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAdd() {
    const name = newName.trim()
    if (!name) return
    const formData = new FormData()
    formData.set("name", name)
    formData.set("category", "Personalizados")

    startAdding(async () => {
      const res = await addIngredient(formData)
      if (res.error) {
        toast.error(res.error)
        return
      }
      const tempId = `custom:${name}`
      setIngredients((prev) => [
        { id: tempId, name, category: "Personalizados", isCustom: true },
        ...prev,
      ])
      setSelected((prev) => new Set(prev).add(tempId))
      setNewName("")
      setShowAddForm(false)
      toast.success(`"${name}" adicionado`)
    })
  }

  async function handleGenerate() {
    if (!selectedNames.length) {
      toast.error("Selecione pelo menos um ingrediente.")
      return
    }
    setGenerating(true)
    setRecipe(null)
    const res = await generateRecipe(selectedNames)
    setGenerating(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    setRecipe({ title: res.title, content: res.content })
    toast.success("Receita gerada e salva no histórico!")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">O que vamos cozinhar?</h1>
        <p className="mt-1 text-muted-foreground">
          Selecione os ingredientes disponíveis e gere uma receita com IA.
        </p>
      </div>

      {/* Selecionados + ação */}
      <div className="mb-6 rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            Selecionados ({selectedNames.length}):
          </span>
          {selectedNames.length === 0 ? (
            <span className="text-sm text-muted-foreground">nenhum ingrediente ainda</span>
          ) : (
            ingredients
              .filter((i) => selected.has(i.id))
              .map((i) => (
                <Badge key={i.id} variant="secondary" className="gap-1">
                  {i.name}
                  <button
                    onClick={() => toggle(i.id)}
                    className="ml-0.5 rounded-full hover:text-destructive"
                    aria-label={`Remover ${i.name}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))
          )}
        </div>
        <Button
          onClick={handleGenerate}
          disabled={generating || selectedNames.length === 0}
          className="mt-4 w-full sm:w-auto"
          size="lg"
        >
          {generating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {generating ? "Gerando receita..." : "Gerar receita"}
        </Button>
      </div>

      {/* Resultado */}
      {(generating || recipe) && (
        <div className="mb-6">
          {generating ? (
            <div className="flex items-center gap-2 rounded-xl border bg-card p-6 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              O chef de IA está pensando na receita perfeita...
            </div>
          ) : (
            recipe && <RecipeView title={recipe.title} content={recipe.content} />
          )}
        </div>
      )}

      {/* Busca e cadastro */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ingrediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => setShowAddForm((v) => !v)}>
          <Plus className="size-4" />
          Novo ingrediente
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="new-ingredient" className="mb-2 block">
              Nome do ingrediente
            </Label>
            <Input
              id="new-ingredient"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Quinoa"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <Button onClick={handleAdd} disabled={adding || !newName.trim()}>
            {adding && <Loader2 className="size-4 animate-spin" />}
            Adicionar
          </Button>
        </div>
      )}

      {/* Lista por categoria */}
      <div className="flex flex-col gap-6">
        {grouped.map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {category}
            </h2>
            <div className="flex flex-wrap gap-2">
              {items.map((ing) => {
                const isSelected = selected.has(ing.id)
                return (
                  <button
                    key={ing.id}
                    onClick={() => toggle(ing.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-secondary"
                    }`}
                  >
                    {ing.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum ingrediente encontrado para &quot;{search}&quot;.
          </p>
        )}
      </div>
    </div>
  )
}
