import { getIngredients } from "@/app/actions/ingredients"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  const ingredients = await getIngredients()
  return <DashboardClient initialIngredients={ingredients} />
}
