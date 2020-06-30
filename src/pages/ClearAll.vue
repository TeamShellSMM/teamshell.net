<template>
  <div class="row">
  </div>
</template>

<script>
  export default {
    name: 'ClearAll',
    data() {
      return {
      };
    },
    mounted(){
      localStorage.clear();
      this.$router.push("/");
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
