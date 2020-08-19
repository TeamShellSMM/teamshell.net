<template>
  <div class="container">
    <h2 id="table_title" :class="$route.params.team + '-secondary-fg maker-detail-title'">Team Settings: Commands</h2>
    <form v-on:submit.prevent="onSubmit">
    <table class='table'>
    <thead>
      <tr>
        <th>Command Name</th>
        <th>Disabled</th>
        <th>Roles</th>
        <th>Text Channels</th>
        <th>Channel Categories</th>
      </tr>
    </thead>
    <tr
      v-for="d in data.commandPermissions"
      :key="d.id">
      <td>
        <select class="form-control" v-model="d.command_id">
          <option v-for="c in data.commands" :key="c.id" :value="c.id">{{c.name}}</option>
        </select>
      </td>
      <td><input class="form-control" type="checkbox" v-model="d.disabled"/></td>
      <td><input class="form-control" type="text" v-model="d.roles"/></td>
      <td><input class="form-control" type="text" v-model="d.text_channels"/></td>
      <td><input class="form-control" type="text" v-model="d.channel_categories"/></td>
    </tr>
    <tr><td colspan="7"><button type="button" class="btn btn-success btn-lg btn-block" @click="addRow">Add Command Permission</button></td></tr>
    </table>
    <button type="submit" class="btn btn-primary btn-lg btn-block">Save Settings</button>
</form>
  </div>
</template>
<script>
  import { loadEndpoint } from '../services/helper-service';

  export default {
    name: 'AdminCommands',
    data() {
      return {
        data:{
          commands: [],
          commandPermissions: []
        },
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
        let that=this
        this.$dialog
          .confirm('Are you sure you want to save?')
          .then(function() {
            loadEndpoint({
              type:'put',
              route:'teams/commandpermissions',
              that,
              data:{
                data:that.data.commandPermissions,
              },
              onLoad(){
                that.$dialog.alert('Command Permissions saved')
                that.$router.push("/" + that.$route.params.team + "/levels");
              }
            })
          })
      },
      addRow(){
        this.data.commandPermissions.push({})
      },
      getData(){
        $('.loader').show();
        let that = this;
        loadEndpoint({
          route:'teams/commandpermissions',
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