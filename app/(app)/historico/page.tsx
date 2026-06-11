import { getHistory } from "@/app/actions/recipes"
import { HistoryList } from "@/components/history-list"

export default async function HistoricoPage() {
  const items = await getHistory()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Histórico de receitas</h1>
        <p className="mt-1 text-muted-foreground">
          Todas as receitas que você gerou ficam salvas aqui.
        </p>
      </div>
      <HistoryList items={items} />
    </div>
  )
}
