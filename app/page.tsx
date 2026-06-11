import Link from "next/link"
import { redirect } from "next/navigation"
import { ChefHat, Sparkles, History, Carrot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) redirect("/dashboard")
  }

  return (
    <main className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ChefHat className="size-5" />
          </div>
          <span className="text-lg font-semibold">Receita IA</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" render={<Link href="/login" />}>
            Entrar
          </Button>
          <Button render={<Link href="/cadastro" />}>Criar conta</Button>
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          <Sparkles className="size-4 text-primary" />
          Receitas geradas por inteligência artificial
        </div>
        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight md:text-6xl">
          Transforme os ingredientes que você tem em receitas deliciosas
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Selecione os ingredientes da sua cozinha e deixe a IA sugerir a
          receita perfeita. Simples, rápido e sem desperdício.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/cadastro" />}>
            Começar agora
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/login" />}>
            Já tenho conta
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
          <Feature
            icon={<Carrot className="size-6" />}
            title="Escolha ingredientes"
            description="Selecione de uma lista ampla ou cadastre os seus próprios."
          />
          <Feature
            icon={<Sparkles className="size-6" />}
            title="IA cria a receita"
            description="O Gemini sugere uma receita completa com modo de preparo."
          />
          <Feature
            icon={<History className="size-6" />}
            title="Histórico salvo"
            description="Todas as receitas geradas ficam guardadas para consultar depois."
          />
        </div>
      </section>
    </main>
  )
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
