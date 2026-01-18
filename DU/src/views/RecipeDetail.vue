<template>
  <div class="container">
    <div v-if="recipe">
      <div class="recipe-header">
        <button @click="goBack" class="back-btn">← Späť</button>
        <div class="header-actions">
          <button 
            v-if="recipe.isOwned && !isEditing"
            @click="startEdit"
            class="edit-btn"
          >
            ✏️ Upraviť
          </button>
          <button 
            @click="toggleFavorite"
            class="favorite-btn large"
            :class="{ active: isFavorite }"
          >
            {{ isFavorite ? '❤️ Odobrať z obľúbených' : '🤍 Pridať do obľúbených' }}
          </button>
        </div>
      </div>

      <!-- View Mode -->
      <div v-if="!isEditing" class="recipe-detail">
        <div class="recipe-image-large" :class="{ 'has-image': recipe.image }">
          <img v-if="recipe.image" :src="recipe.image" :alt="recipe.name" />
          <span v-else class="emoji-large">{{ recipe.emoji }}</span>
        </div>
        <h2>{{ recipe.name }}</h2>
        
        <div class="recipe-meta">
          <span>⏱️ {{ recipe.time }} minút</span>
          <span>📊 {{ recipe.difficulty }}</span>
        </div>

        <div class="recipe-section">
          <h3>Ingrediencie</h3>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <div class="recipe-section">
          <h3>Postup</h3>
          <p class="instructions">{{ recipe.instructions }}</p>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="recipe-detail edit-mode">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label>Názov receptu</label>
          <input v-model="editForm.name" type="text">
        </div>

        <div class="form-group">
          <label>Emoji</label>
          <input v-model="editForm.emoji" type="text" maxlength="2">
        </div>

        <div class="form-group">
          <label>URL obrázka (voliteľné)</label>
          <input v-model="editForm.image" type="url">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Čas prípravy (min)</label>
            <input v-model.number="editForm.time" type="number">
          </div>

          <div class="form-group">
            <label>Obtiažnosť</label>
            <select v-model="editForm.difficulty">
              <option value="Ľahká">Ľahká</option>
              <option value="Stredná">Stredná</option>
              <option value="Náročná">Náročná</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Ingrediencie (jeden na riadok)</label>
          <textarea v-model="ingredientsText" rows="5"></textarea>
        </div>

        <div class="form-group">
          <label>Postup prípravy</label>
          <textarea v-model="editForm.instructions" rows="8"></textarea>
        </div>

        <div class="form-actions">
          <button @click="saveEdit" class="add-btn">💾 Uložiť zmeny</button>
          <button @click="cancelEdit" class="cancel-btn">Zrušiť</button>
          <button @click="deleteRecipe" class="delete-btn">🗑️ Vymazať recept</button>
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      Recept nebol nájdený
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocalStorage, useTitle } from '@vueuse/core'

export default {
  name: 'RecipeDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const recipes = useLocalStorage('recipes', [])
    const favorites = useLocalStorage('favorites', [])
    
    const isEditing = ref(false)
    const editForm = ref({})
    const ingredientsText = ref('')
    const errorMessage = ref('')

    const recipe = computed(() => {
      const id = parseInt(route.params.id)
      return recipes.value.find(r => r.id === id)
    })

    // Dynamic title
    useTitle(computed(() => recipe.value ? `${recipe.value.name} - Recipe Book` : 'Recipe Book'))

    const isFavorite = computed(() => {
      return favorites.value.includes(parseInt(route.params.id))
    })

    const toggleFavorite = () => {
      const id = parseInt(route.params.id)
      const index = favorites.value.indexOf(id)
      
      if (index > -1) {
        favorites.value.splice(index, 1)
      } else {
        favorites.value.push(id)
      }
    }

    const startEdit = () => {
      if (!recipe.value) return
      
      editForm.value = {
        name: recipe.value.name,
        emoji: recipe.value.emoji,
        image: recipe.value.image || '',
        time: recipe.value.time,
        difficulty: recipe.value.difficulty,
        instructions: recipe.value.instructions
      }
      
      ingredientsText.value = recipe.value.ingredients.join('\n')
      isEditing.value = true
    }

    const saveEdit = () => {
      // Validation
      if (!editForm.value.name.trim()) {
        showError('Názov receptu nesmie byť prázdny!')
        return
      }

      if (!ingredientsText.value.trim()) {
        showError('Pridajte aspoň jednu ingredienciu!')
        return
      }

      if (!editForm.value.instructions.trim()) {
        showError('Pridajte postup prípravy!')
        return
      }

      // Parse ingredients
      const ingredients = ingredientsText.value
        .split('\n')
        .map(i => i.trim())
        .filter(i => i.length > 0)

      // Update recipe
      const id = parseInt(route.params.id)
      const index = recipes.value.findIndex(r => r.id === id)
      
      if (index !== -1) {
        recipes.value[index] = {
          ...recipes.value[index],
          name: editForm.value.name.trim(),
          emoji: editForm.value.emoji || '🍽️',
          image: editForm.value.image.trim() || null,
          time: editForm.value.time,
          difficulty: editForm.value.difficulty,
          ingredients: ingredients,
          instructions: editForm.value.instructions.trim()
        }
      }

      isEditing.value = false
      errorMessage.value = ''
    }

    const cancelEdit = () => {
      isEditing.value = false
      errorMessage.value = ''
    }

    const deleteRecipe = () => {
      if (!confirm('Naozaj chcete vymazať tento recept?')) return
      
      const id = parseInt(route.params.id)
      const index = recipes.value.findIndex(r => r.id === id)
      
      if (index !== -1) {
        recipes.value.splice(index, 1)
        
        // Remove from favorites if present
        const favIndex = favorites.value.indexOf(id)
        if (favIndex > -1) {
          favorites.value.splice(favIndex, 1)
        }
      }
      
      router.push('/')
    }

    const showError = (message) => {
      errorMessage.value = message
      setTimeout(() => {
        errorMessage.value = ''
      }, 3000)
    }

    const goBack = () => {
      router.back()
    }

    return {
      recipe,
      isFavorite,
      isEditing,
      editForm,
      ingredientsText,
      errorMessage,
      toggleFavorite,
      startEdit,
      saveEdit,
      cancelEdit,
      deleteRecipe,
      goBack
    }
  }
}
</script>
