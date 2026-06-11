export type Ingredient = {
  _id?: string
  name: string
  category: string
  userId?: string | null // null = ingrediente padrão (global)
  createdAt?: Date
}

export type RecipeHistory = {
  _id?: string
  userId: string
  title: string
  ingredients: string[]
  content: string
  createdAt: Date
}

export const DEFAULT_INGREDIENTS: { name: string; category: string }[] = [
  // Proteínas
  { name: "Frango", category: "Proteínas" },
  { name: "Carne bovina", category: "Proteínas" },
  { name: "Carne suína", category: "Proteínas" },
  { name: "Peixe", category: "Proteínas" },
  { name: "Camarão", category: "Proteínas" },
  { name: "Ovos", category: "Proteínas" },
  { name: "Tofu", category: "Proteínas" },
  { name: "Bacon", category: "Proteínas" },
  // Vegetais e legumes
  { name: "Tomate", category: "Vegetais e Legumes" },
  { name: "Cebola", category: "Vegetais e Legumes" },
  { name: "Alho", category: "Vegetais e Legumes" },
  { name: "Cenoura", category: "Vegetais e Legumes" },
  { name: "Batata", category: "Vegetais e Legumes" },
  { name: "Abobrinha", category: "Vegetais e Legumes" },
  { name: "Pimentão", category: "Vegetais e Legumes" },
  { name: "Brócolis", category: "Vegetais e Legumes" },
  { name: "Espinafre", category: "Vegetais e Legumes" },
  { name: "Cogumelo", category: "Vegetais e Legumes" },
  { name: "Milho", category: "Vegetais e Legumes" },
  { name: "Abóbora", category: "Vegetais e Legumes" },
  // Carboidratos
  { name: "Arroz", category: "Carboidratos" },
  { name: "Macarrão", category: "Carboidratos" },
  { name: "Pão", category: "Carboidratos" },
  { name: "Batata doce", category: "Carboidratos" },
  { name: "Farinha de trigo", category: "Carboidratos" },
  { name: "Mandioca", category: "Carboidratos" },
  // Laticínios
  { name: "Queijo", category: "Laticínios" },
  { name: "Leite", category: "Laticínios" },
  { name: "Manteiga", category: "Laticínios" },
  { name: "Creme de leite", category: "Laticínios" },
  { name: "Iogurte", category: "Laticínios" },
  { name: "Requeijão", category: "Laticínios" },
  // Leguminosas
  { name: "Feijão", category: "Leguminosas" },
  { name: "Lentilha", category: "Leguminosas" },
  { name: "Grão-de-bico", category: "Leguminosas" },
  { name: "Ervilha", category: "Leguminosas" },
  // Temperos e ervas
  { name: "Sal", category: "Temperos e Ervas" },
  { name: "Pimenta", category: "Temperos e Ervas" },
  { name: "Manjericão", category: "Temperos e Ervas" },
  { name: "Salsa", category: "Temperos e Ervas" },
  { name: "Orégano", category: "Temperos e Ervas" },
  { name: "Coentro", category: "Temperos e Ervas" },
  { name: "Azeite", category: "Temperos e Ervas" },
  { name: "Gengibre", category: "Temperos e Ervas" },
  // Frutas
  { name: "Limão", category: "Frutas" },
  { name: "Banana", category: "Frutas" },
  { name: "Maçã", category: "Frutas" },
  { name: "Laranja", category: "Frutas" },
  { name: "Abacate", category: "Frutas" },
  { name: "Morango", category: "Frutas" },
]
