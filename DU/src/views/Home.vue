<template>
  <div class="container">
    <header>
      <h2>Všetky recepty</h2>
    </header>

    <div class="search-section">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Hľadať recept..."
        class="search-input"
      >
    </div>

    <div class="recipes-grid">
      <div 
        v-for="recipe in filteredRecipes" 
        :key="recipe.id"
        class="recipe-card"
        @click="goToRecipe(recipe.id)"
      >
        <div class="recipe-image" :class="{ 'has-image': recipe.image }">
          <img v-if="recipe.image" :src="recipe.image" :alt="recipe.name" />
          <span v-else class="emoji">{{ recipe.emoji }}</span>
        </div>
        <div class="recipe-info">
          <h3>{{ recipe.name }}</h3>
          <p class="recipe-time">⏱️ {{ recipe.time }} min</p>
          <p class="recipe-difficulty">{{ recipe.difficulty }}</p>
        </div>
        <button 
          @click.stop="toggleFavorite(recipe.id)"
          class="favorite-btn"
          :class="{ active: isFavorite(recipe.id) }"
        >
          {{ isFavorite(recipe.id) ? '❤️' : '🤍' }}
        </button>
      </div>
    </div>

    <div v-if="filteredRecipes.length === 0" class="no-results">
      Žiadne recepty nenájdené
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage, useTitle, useDebounceFn } from '@vueuse/core'

export default {
  name: 'Home',
  setup() {
    useTitle('Recipe Book - Všetky recepty')

    const router = useRouter()
    const searchQuery = ref('')
    
    // VueUse - persist data
    const recipes = useLocalStorage('recipes', [
      {
        id: 1,
        name: 'Spaghetti Carbonara',
        emoji: '🍝',
        time: 25,
        difficulty: 'Stredná',
        ingredients: ['400g spaghetti', '200g slanina', '4 vajcia', '100g parmezán', 'soľ, korenie'],
        instructions: '1. Uvarte cestoviny\n2. Opečte slaninu\n3. Zmiešajte vajcia s parmezánom\n4. Spojte všetko dohromady'
      },
      {
        id: 2,
        name: 'Caesar šalát',
        emoji: '🥗',
        time: 15,
        difficulty: 'Ľahká',
        ingredients: ['Rímsky šalát', 'Krutóny', 'Parmezán', 'Kurča', 'Caesar dresing'],
        instructions: '1. Natrháme šalát\n2. Pridáme nakrájané kurča\n3. Posypeme parmezánom a krutónmi\n4. Zalejeme dresingom'
      },
      {
        id: 3,
        name: 'Čokoládový brownie',
        emoji: '🍫',
        time: 40,
        difficulty: 'Ľahká',
        ingredients: ['200g čokoláda', '150g maslo', '200g cukor', '3 vajcia', '100g múka'],
        instructions: '1. Roztopte čokoládu s maslom\n2. Pridajte cukor a vajcia\n3. Vmiešajte múku\n4. Pečte 25-30 min na 180°C'
      }
    ])

    const favorites = useLocalStorage('favorites', [])

    // Debounced search
    const debouncedSearch = useDebounceFn(() => {
      return searchQuery.value
    }, 300)

    const filteredRecipes = computed(() => {
      const query = searchQuery.value.toLowerCase().trim()
      if (!query) return recipes.value
      
      return recipes.value.filter(recipe => 
        recipe.name.toLowerCase().includes(query) ||
        recipe.difficulty.toLowerCase().includes(query)
      )
    })

    const goToRecipe = (id) => {
      router.push(`/recipe/${id}`)
    }

    const toggleFavorite = (id) => {
      const index = favorites.value.indexOf(id)
      if (index > -1) {
        favorites.value.splice(index, 1)
      } else {
        favorites.value.push(id)
      }
    }

    const isFavorite = (id) => {
      return favorites.value.includes(id)
    }

    return {
      searchQuery,
      filteredRecipes,
      goToRecipe,
      toggleFavorite,
      isFavorite
    }
  }
}
</script>
