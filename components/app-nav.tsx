import Link from "next/link"
import { ChefHat, History, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"

export function AppNav({ email }: { email?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ChefHat className="size-4" />
          </div>
          <span className="font-semibold">Receita IA</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link href="/dashboard">
                <Sparkles className="size-4" />
                <span className="hidden sm:inline">Gerar</span>
              </Link>
            }
          />
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link href="/historico">
                <History className="size-4" />
                <span className="hidden sm:inline">Histórico</span>
              </Link>
            }
          />
          <form action={signOut}>
            <Button variant="outline" size="sm" type="submit">
              Sair
            </Button>
          </form>
        </nav>
      </div>
      {email && (
        <div className="border-t bg-muted/30">
          <p className="mx-auto max-w-5xl px-4 py-1.5 text-xs text-muted-foreground">
            Conectado como {email}
          </p>
        </div>
      )}
    </header>
  )
}
