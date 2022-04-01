<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" @click.prevent="$router.push('/game')">
        <img src="https://fiipractic.asii.ro/assets/images/fp-logo.svg" alt="">
      </a>
      <div class="navbar-nav">
        <a class="nav-link  float-right" href="#"  @click.prevent="$router.push('/')">Game</a>
        <a class="nav-link  float-right" href="#">Logout</a>
      </div>
    </div>
  </nav>
</template>