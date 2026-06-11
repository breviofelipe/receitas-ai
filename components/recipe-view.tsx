import { ChefHat } from "lucide-react"

// Renderizador simples de Markdown para o formato de receita gerado pelo Gemini.
export function RecipeView({ title, content }: { title: string; content: string }) {
  const lines = content.split("\n")

  return (
    <article className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center gap-2 text-primary">
        <ChefHat className="size-5" />
        <span className="text-sm font-medium uppercase tracking-wide">Receita gerada</span>
      </div>
      <div className="flex flex-col gap-1">
        {lines.map((raw, i) => {
          const line = raw.trimEnd()
          if (!line.trim()) return <div key={i} className="h-2" />

          if (line.startsWith("## ")) {
            return (
              <h3 key={i} className="mt-4 text-lg font-semibold">
                {line.replace("## ", "")}
              </h3>
            )
          }
          if (line.startsWith("# ")) {
            return (
              <h2 key={i} className="text-2xl font-bold text-balance">
                {line.replace("# ", "")}
              </h2>
            )
          }
          if (/^\s*[-*]\s+/.test(line)) {
            return (
              <div key={i} className="flex gap-2 pl-1 leading-relaxed">
                <span className="text-primary">•</span>
                <span>{renderInline(line.replace(/^\s*[-*]\s+/, ""))}</span>
              </div>
            )
          }
          const numbered = line.match(/^\s*(\d+)\.\s+(.*)/)
          if (numbered) {
            return (
              <div key={i} className="flex gap-2 leading-relaxed">
                <span className="font-semibold text-primary">{numbered[1]}.</span>
                <span>{renderInline(numbered[2])}</span>
              </div>
            )
          }
          return (
            <p key={i} className="leading-relaxed">
              {renderInline(line)}
            </p>
          )
        })}
      </div>
    </article>
  )
}

// Trata negrito (**texto**) inline.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}
