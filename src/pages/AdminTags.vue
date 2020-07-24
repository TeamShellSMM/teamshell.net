<template>
  <div class="container">
    <h2 id="table_title" :class="$route.params.team + '-secondary-fg maker-detail-title'">Team Settings: Tags</h2>
    <form v-on:submit.prevent="onSubmit">
    <table class='table'>
    <thead>
      <tr><th>Tag Name</th><th>Color</th><th>Seperate</th><th>Add Lock</th><th>Remove Lock</th><th>Hidden</th><th>Verify Clears</th></tr>
    </thead>
    <tr
      v-for="d in data"
      :key="d.id">
      <td><input class="form-control" type="text" v-model="d.name"/></td>
      <td>
        <select class="form-control" v-model="d.type">
          <option value="">-</option>
          <option value="primary">Blue</option>
          <option value="info">Light Blue</option>
          <option value="success">Green</option>
          <option value="warning">Yellow</option>
          <option value="danger">Red</option>
        </select>
      </td>
      <td><input class="form-control" type="checkbox" v-model="d.is_seperate"/></td>
      <td><input class="form-control" type="checkbox" v-model="d.add_lock"/></td>
      <td><input class="form-control" type="checkbox" v-model="d.remove_lock"/></td>
      <td><input class="form-control" type="checkbox" v-model="d.is_hidden"/></td>
      <td><input class="form-control" type="checkbox" v-model="d.verify_clears"/></td>
    </tr>
    <tr><td colspan="7"><button type="button" class="btn btn-success btn-lg btn-block" @click="addRow">Add Row</button></td></tr>
    </table>
    <button type="submit" class="btn btn-primary btn-lg btn-block">Save Settings</button>
</form>
  </div>
</template>
<script>
  import { loadEndpoint } from '../services/helper-service';

  export default {
    name: 'AdminTags',
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
      onSubmit(){
        console.log(this.data)
        let that=this
        this.$dialog
          .confirm('Are you sure you want to save?')
          .then(function() {
            loadEndpoint({
              type:'put',
              route:'teams/tags',
              that,
              data:{
                data:that.data,
              },
              onLoad(){
                that.$dialog.alert('Tags saved')
                that.$router.push("/" + that.$route.params.team + "/levels");
              }
            })
          })
      },
      addRow(){
        this.data.push({})
      },
      getData(){
        $('.loader').show();
        let that = this;
        loadEndpoint({
          route:'teams/tags',
          that,
          onLoad(_rawData){
            that.data=_rawData.data
            that.refresh()
          },
        })
      }
    }
  }
</script>