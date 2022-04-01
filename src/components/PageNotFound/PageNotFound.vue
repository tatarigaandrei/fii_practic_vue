<template>
    <div class="container pt-5">
      <div class="row justify-content-center">
        <div class="col-md-12 text-center">
          <span class="display-1 d-block">404</span>
          <div class="mb-4 lead">The page you are looking for was not found.</div>
          <a @click.prevent="$router.push('/admin/song')" href="https://www.totoprayogo.com/#" class="btn btn-link">Back to Home</a>
        </div>
      </div>
    </div>
</template>
<script >
export default {
  data() {
    return {
    }
  }
}
</script>

<style>

</style>
