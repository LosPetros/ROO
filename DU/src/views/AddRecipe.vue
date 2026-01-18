<template>
  <div class="container">
    <header>
      <h2>Pridať nový recept</h2>
    </header>

    <div class="form-section">
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div class="form-group">
        <label>Názov receptu</label>
        <input 
          v-model="newRecipe.name"
          type="text" 
          placeholder="napr. Spaghetti Bolognese"
        >
      </div>

      <div class="form-group">
        <label>Emoji 🍕</label>
        <input 
          v-model="newRecipe.emoji"
          type="text" 
          placeholder="🍝"
          maxlength="2"
        >
      </div>

      <div class="form-group">
        <label>URL obrázka (voliteľné)</label>
        <input 
          v-model="newRecipe.image"
          type="url" 
          placeholder="https://..."
        >
        <small class="hint">Ak pridáte URL obrázka, zobrazí sa namiesto emoji</small>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Čas prípravy (min)</label>
          <input 
            v-model.number="newRecipe.time"
            type="number" 
            placeholder="30"
          >
        </div>

        <div class="form-group">
          <label>Obtiažnosť</label>
          <select v-model="newRecipe.difficulty">
            <option value="Ľahká">Ľahká</option>
            <option value="Stredná">Stredná</option>
            <option value="Náročná">Náročná</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Ingrediencie (jeden na riadok)</label>
        <textarea 
          v-model="ingredientsText"
          rows="5"
          placeholder="200g múka&#10;2 vajcia&#10;100ml mlieko"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Postup prípravy</label>
        <textarea 
          v-model="newRecipe.instructions"
          rows="8"
          placeholder="1. Najprv...&#10;2. Potom...&#10;3. Nakoniec..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button @click="addRecipe" class="add-btn">Pridať recept</button>
        <button @click="resetForm" class="cancel-btn">Zrušiť</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage, useTitle } from '@vueuse/core'

export default {
  name: 'AddRecipe',
  setup() {
    useTitle('Pridať recept - Recipe Book')

    const router = useRouter()
    const recipes = useLocalStorage('recipes', [])
    
    const newRecipe = ref({
      name: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      time: 30,
      difficulty: 'Stredná',
      instructions: ''
    })

    const ingredientsText = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')

    const addRecipe = () => {
      // Validation
      if (!newRecipe.value.name.trim()) {
        showError('Názov receptu nesmie byť prázdny!')
        return
      }

      if (!ingredientsText.value.trim()) {
        showError('Pridajte aspoň jednu ingredienciu!')
        return
      }

      if (!newRecipe.value.instructions.trim()) {
        showError('Pridajte postup prípravy!')
        return
      }

      if (newRecipe.value.time <= 0) {
        showError('Čas prípravy musí byť väčší ako 0!')
        return
      }

      // Parse ingredients
      const ingredients = ingredientsText.value
        .split('\n')
        .map(i => i.trim())
        .filter(i => i.length > 0)

      // Create recipe
      const recipe = {
        id: Date.now(),
        name: newRecipe.value.name.trim(),
        emoji: newRecipe.value.emoji || '🍽️',
        image: newRecipe.value.image.trim() || null,
        time: newRecipe.value.time,
        difficulty: newRecipe.value.difficulty,
        ingredients: ingredients,
        instructions: newRecipe.value.instructions.trim(),
        isOwned: true // Mark as user's recipe
      }

      recipes.value.push(recipe)
      
      showSuccess('Recept bol úspešne pridaný!')
      
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }

    const resetForm = () => {
      newRecipe.value = {
        name: '',
        emoji: '🍽️',
        image: '',
        time: 30,
        difficulty: 'Stredná',
        instructions: ''
      }
      ingredientsText.value = ''
      errorMessage.value = ''
      successMessage.value = ''
    }

    const showError = (message) => {
      errorMessage.value = message
      successMessage.value = ''
      setTimeout(() => {
        errorMessage.value = ''
      }, 3000)
    }

    const showSuccess = (message) => {
      successMessage.value = message
      errorMessage.value = ''
    }

    return {
      newRecipe,
      ingredientsText,
      errorMessage,
      successMessage,
      addRecipe,
      resetForm
    }
  }
}
</script>
