<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <!-- <router-link to="/counter">Counter</router-link> | -->
    <!-- <router-link to="/sample-file">Sample File</router-link> | -->
    <!-- <router-link to="/model-test">Model Test</router-link> | -->
    <!-- <router-link to="/test-reactive-array">Test Reactive Array</router-link> | -->
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  & > * {
    margin: 0.5em;
  }
}

.error {
  color: red;
  font-weight: bold;;
}

a.button-link {
  text-decoration: none;
  color: blue;
  cursor: pointer;

  &:hover {
      text-decoration: underline;
  }
}
</style>
