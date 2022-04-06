<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" @click.prevent="$router.push('/admin/song')">
        <img src="https://fiipractic.asii.ro/assets/images/fp-logo.svg" alt="">
      </a>
      <div class="navbar-nav">
        <a class="nav-link  float-right" href="#"  @click.prevent="$router.push('/')">Game</a>
        <a @click="logout()" class="nav-link  float-right" href="#">Logout</a>
      </div>
    </div>
  </nav>
</template>
<script >
export default {
  data() {
    return {
    }
  },
  methods: {
    logout() {
      window.localStorage.setItem('token', null);
      this.$router.push({ path: '/login'});
    }
  }
}
</script>
