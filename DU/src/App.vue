<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <h1 class="logo">🍳 Recipe Book</h1>
        <div class="nav-links">
          <router-link to="/">Recepty</router-link>
          <router-link to="/favorites">Obľúbené</router-link>
          <router-link to="/add">+ Pridať</router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
