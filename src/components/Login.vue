<template>
  <div class="row">

  </div>
</template>

<script>
  import {loadEndpoint } from '../services/helper-service';

  export default {
    name: 'Login',
    data() {
      return {
      };
    },
    mounted(){
      $('.loader').show();
      console.log("trying to login with", this.$route.params.otp);

      let that = this;

      loadEndpoint({
        that,
        route:'json/login',
        data:{
          otp:that.$route.params.otp,
        },
        onLoad(data){
          if(data.status == "error"){
            $('.loader').hide();
            alert(data.message);
            that.$dialog.alert(data.message).then(function(dialog) {
              console.log(dialog);
            });
            that.$router.push("/" + that.$route.params.team + "/levels");
          }
          if(data.status == "logged_in"){
            that.$store.commit(that.$route.params.team + '/setToken', { token: data.token });
            that.$store.commit(that.$route.params.team + '/setUserInfo', { user_info: data.user_info });
            localStorage.setItem('member', data.user_info.name);
            that.$router.push("/" + that.$route.params.team + "/levels");
          }
        },
      })

      /**/
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
