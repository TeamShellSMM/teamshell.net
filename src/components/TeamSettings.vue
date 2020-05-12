<template>
  <div class="container">
    <h2 id="table_title" :class="$route.params.team + '-secondary-fg maker-detail-title'">Team Settings</h2>
    <form v-on:submit.prevent="onSubmit">
    <div 
      v-for="d in data"
      :key="d.name"
      class="form-group row">
      <label for="" class="col-sm-2 col-form-label">{{d.name}}</label>
      <div class="col-sm-10">
        <input :id="d.name" v-model="d.value" @change="inputChange" v-if="d.type=='text'" type="text" class="form-control">
        <input :id="d.name" v-model="d.value" @change="inputChange" v-if="d.type=='number'" type="number" class="form-control">
        <input :id="d.name" v-model="d.value" @change="inputChange" v-if="d.type=='boolean'" type="checkbox" class="form-control">
        <small>{{d.description}}</small>
      </div>
    </div>
    <button type="submit" class="btn btn-primary btn-lg btn-block">Save Settings</button>
</form>
    
  </div>
</template>

<script>
  import { loadEndpoint } from '../services/helper-service';

  export default {
    name: 'Levels',
    data() {
      return {
        data:[],
        ...this.$store.state[this.$route.params.team].teamvars,
      };
    },
    mounted(){
      
      this.getData();
    },
    computed: {
      loggedIn: function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].token ? true : false;
        }
        return false;
      },
      username:function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].user_info.name;
        }
        return false;
      },
    },
    methods:{
      refresh(){
        $('.loader').hide()
      },
      inputChange(){
        console.log(this.data.map((d)=> { return { name:d.name,value:d.value } }))
      },
      onSubmit(){
        let that=this
        this.$dialog
          .confirm('Are you sure you want to save?')
          .then(function() {
            loadEndpoint({
              type:'put',
              route:'teams/settings',
              that,
              data:{
                data:that.data.map((d)=> { return { name:d.name,value:d.value } })
              },
              onLoad(){
                that.$dialog.alert('Settings saved')
                that.$router.push("/" + that.$route.params.team + "/levels");
              }
            })
          })
      },
      getData(){
        $('.loader').show();
        let that = this;
        loadEndpoint({
          route:'teams/settings',
          that,
          onLoad(_rawData){
            console.log(_rawData)
            that.data=_rawData.settings
            that.refresh()
          },
        })
      }
    }
  }
</script>