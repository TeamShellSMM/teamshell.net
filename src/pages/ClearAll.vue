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
      let that = this;

      that.$dialog.alert("", {
        view: "clear-all-view"
      }).then(function() {
        that.$router.push("/");
      });

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
