<template>
  <div class="row">

  </div>
</template>

<script>
  import { login } from '../services/helper-service';

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

      login(this.$route.params.otp, function(data){
        if(data.status == "error"){
          $('.loader').hide();
          alert(data.message);
          that.$dialog.alert(data.message).then(function(dialog) {
            console.log(dialog);
          });
          that.$router.push("/levels");
        }
        if(data.status == "logged_in"){
          that.$store.commit('setToken', { token: data.token });
          that.$store.commit('setUserInfo', { user_info: data.user_info });
          localStorage.setItem('member', data.user_info.Name);
          that.$router.push("/levels");
        }
      });

      /**/
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
