
<template>
  <h1>{{this.playerStore.playerIcon}}</h1>
</template>
<script >
import {usePlayerStore} from "../stores/player.js";

export default {
  name: "HelloWorld",
  setup(){
    const playerStore = usePlayerStore();
    return {
      playerStore
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>

</style>
