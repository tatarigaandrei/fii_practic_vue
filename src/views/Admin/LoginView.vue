<template>
  <div class="container">
    <div class="row pt-5">
      <div class="col"></div>
      <div class="col">
        <h1>Login</h1>
        <form method="post" >
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input required type="email" v-model="username" name="username" class="form-control" id="username">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input required type="password" v-model="password" name="password" class="form-control" id="password">
          </div>

          <button @click="login" type="button" class="btn btn-primary">Submit</button>
        </form>
      </div>
      <div class="col"></div>
    </div>

  </div>
</template>
<script >
import {login} from "../../api/admin/login";

export default {
  data() {
    return {
      username: null,
      password: null
    }
  },
  methods: {
    async login() {
        try{
          let {data} = await login({
            'username': this.username,
            'password': this.password
          })
          window.localStorage.setItem('token', data.token);
          this.$router.push({ path: '/admin/song'});

        } catch (e) {
          console.log(e);
        } finally {

        }
    }
  }
}
</script>

<style>

</style>
