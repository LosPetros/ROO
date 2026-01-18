# 🍳 Recipe Book App

Interaktívna webová aplikácia pre správu receptov vytvorená vo Vue 3 s Vue Router a VueUse.

## 🚀 Funkcie

- **Prezeranie receptov** - Grid zobrazenie všetkých receptov
- **Vyhľadávanie** - Debounced vyhľadávanie receptov
- **Detail receptu** - Kompletné zobrazenie ingrediencií a postupu
- **Pridávanie receptov** - Formulár pre vytvorenie nových receptov
- **Obľúbené** - Ukladanie obľúbených receptov
- **LocalStorage** - Perzistentné uloženie dát
- **Responsive dizajn** - Funguje na mobiloch aj počítačoch

## 🛠️ Technológie

- Vue 3 (Composition API)
- Vue Router 4
- VueUse (`useLocalStorage`, `useTitle`, `useDebounceFn`)
- Vite

## 📦 Inštalácia

```bash
# Nainštaluj závislosti
npm install

# Spusti dev server
npm run dev

# Build pre produkciu
npm run build
```

## 📖 VueUse funkcie použité

- **useLocalStorage** - Uloženie receptov a obľúbených do localStorage
- **useTitle** - Dynamické názvy stránok
- **useDebounceFn** - Debounced vyhľadávanie

## 📁 Štruktúra projektu

```
DU/
├── src/
│   ├── views/
│   │   ├── Home.vue           # Zoznam receptov
│   │   ├── RecipeDetail.vue   # Detail receptu
│   │   ├── AddRecipe.vue      # Pridať recept
│   │   └── Favorites.vue      # Obľúbené recepty
│   ├── router/
│   │   └── index.js           # Vue Router konfigurácia
│   ├── App.vue                # Hlavný komponent
│   ├── main.js                # Entry point
│   └── style.css              # Globálne štýly
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Dizajn

Moderný, minimalistický dizajn inšpirovaný ExpenseChecker aplikáciou:
- Čistý layout s bielym pozadím
- Čierne a šedé farby pre profesionálny vzhľad
- Hover efekty a transitions
- Responzívny grid systém
