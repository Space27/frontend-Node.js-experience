<script setup>
const props = defineProps({
  link: {
    type: String,
    default: '/'
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <header class="header">
    <router-link :to=link class="logo">
      <img class="logo__image" src='@/assets/logo.png' alt="logo"/>
      <h1 class="logo__title">ЛОНГ/ШОРТ</h1>
    </router-link>

    <h2 class="subtitle">{{ subtitle }}</h2>
  </header>
</template>

<style scoped>
.header {
  background-color: #FFF;
  height: 80px;
  padding: 0 5%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  height: 100%;
  max-width: 300px;
  padding: 5px 0;
  box-sizing: border-box;
  transition: transform .2s ease-out;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo:hover {
  transform: scale(1.01);
}

.logo .logo__image {
  height: 100%;
  border-radius: 40%;
  transition: transform .4s ease-in;
}

.logo .logo__title {
  margin: 0;
  font-family: 'Rubik', serif;
  font-size: 22px;
  font-style: italic;
  font-weight: bold;
  color: #000;
}

.subtitle {
  margin: 0;
  font-family: 'Rubik', serif;
  font-size: 20px;
  font-style: italic;
  font-weight: normal;
  color: #000;
}
</style>
