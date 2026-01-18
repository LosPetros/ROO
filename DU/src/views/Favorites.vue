<template>
  <div class="container">
    <header>
      <h2>Obľúbené recepty</h2>
    </header>

    <div v-if="favoriteRecipes.length > 0" class="recipes-grid">
      <div 
        v-for="recipe in favoriteRecipes" 
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
          @click.stop="removeFavorite(recipe.id)"
          class="favorite-btn active"
        >
          ❤️
        </button>
      </div>
    </div>

    <div v-else class="no-results">
      <p>Zatiaľ nemáte žiadne obľúbené recepty</p>
      <button @click="goToHome" class="add-btn">Prejsť na recepty</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage, useTitle } from '@vueuse/core'

export default {
  name: 'Favorites',
  setup() {
    useTitle('Obľúbené - Recipe Book')

    const router = useRouter()
    const recipes = useLocalStorage('recipes', [])
    const favorites = useLocalStorage('favorites', [])

    const favoriteRecipes = computed(() => {
      return recipes.value.filter(recipe => favorites.value.includes(recipe.id))
    })

    const goToRecipe = (id) => {
      router.push(`/recipe/${id}`)
    }

    const removeFavorite = (id) => {
      const index = favorites.value.indexOf(id)
      if (index > -1) {
        favorites.value.splice(index, 1)
      }
    }

    const goToHome = () => {
      router.push('/')
    }

    return {
      favoriteRecipes,
      goToRecipe,
      removeFavorite,
      goToHome
    }
  }
}
</script>
