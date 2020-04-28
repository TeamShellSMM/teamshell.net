<template>
  <div class="row">
    <div class="container" v-if="$route.params.id == 1">
      <h1 style="margin-top:10px;margin-bottom:10px;font-size:40pt;" class="teamshell-primary-fg">Winners of Shell And Tell 1 - SMB1-like</h1>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-gold"></div></div>Permafrost #ST #TS by <router-link to="/teamshell/maker/TheAnswer">TheAnswer</router-link> (<router-link to="/teamshell/level/4WD-7GR-TWF">4WD-7GR-TWF</router-link>)</h3>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-silver"></div></div>Gamer Jumps but in 8-Bit by <router-link to="/teamshell/maker/Jikurein">Jikurein</router-link> (<router-link to="/teamshell/level/GSQ-B8B-9LG">GSQ-B8B-9LG</router-link>)</h3>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-bronze"></div></div>Infinity by <router-link to="/teamshell/maker/Keenzz">Keenzz</router-link> (<router-link to="/teamshell/level/H61-6P6-15G">H61-6P6-15G</router-link>)</h3>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-iron"></div></div>Reverie #ShellAndTell by <router-link to="/teamshell/maker/salt">salt</router-link> (<router-link to="/teamshell/level/S98-2WV-W4G">S98-2WV-W4G</router-link>)</h3>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-iron"></div></div>Boom Boom's Secret Oasis #TS by <router-link to="/teamshell/maker/geno">geno</router-link> (<router-link to="/teamshell/level/NYP-WCL-XGG">NYP-WCL-XGG</router-link>)</h3>
      <h2 style="margin-top:10px;margin-bottom:10px;" class="teamshell-primary-fg">Honorable Mentions</h2>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Spig's Pick of the Month</span> - Crimson Crystal #TeamShell #ST by <router-link to="/teamshell/maker/BDee3">BDee3</router-link> (<router-link to="/teamshell/level/VV8-VK9-XXF">VV8-VK9-XXF</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Toughest bounce level</span> - Stone Cold Summit (TS) by <router-link to="/teamshell/maker/Khaos">Khaos</router-link> (<router-link to="/teamshell/level/VV8-VK9-XXF">VV8-VK9-XXF</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Best true ending</span> - Maple Bacon #ST by <router-link to="/teamshell/maker/Tooplaya">Tooplaya</router-link> (<router-link to="/teamshell/level/0K0-9W6-1SF">0K0-9W6-1SF</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Most impressive contraption</span> - Shell Conductor: BuzzyXpress #TS by <router-link to="/teamshell/maker/Dr. Groove">Dr. Groove</router-link> (<router-link to="/teamshell/level/VV8-VK9-XXF">G8X-H9T-QGG</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Best aesthetics</span> - Boom Boom's Secret Oasis #TS by <router-link to="/teamshell/maker/geno">geno</router-link> (<router-link to="/teamshell/level/NYP-WCL-XGG">NYP-WCL-XGG</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Crowd Favourite</span> - Permafrost #ST #TS by <router-link to="/teamshell/maker/TheAnswer">TheAnswer</router-link> (<router-link to="/teamshell/level/4WD-7GR-TWF">4WD-7GR-TWF</router-link>)</h4>
    </div>
    <div class="container" v-if="$route.params.id == 2">
      <h1 style="margin-top:10px;margin-bottom:10px;font-size:40pt;" class="teamshell-primary-fg">Winners of Shell And Tell 2 - Night Themes</h1>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-gold"></div></div>Welcome to Midair Canyon by <router-link to="/teamshell/maker/Trakkan">Trakkan</router-link> (<router-link to="/teamshell/level/1MK-T1C-XGG">1MK-T1C-XGG</router-link>)</h3>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-silver"></div></div>Purple Haze #ST #TS by <router-link to="/teamshell/maker/TheAnswer">TheAnswer</router-link> (<router-link to="/teamshell/level/XG0-719-0TF">XG0-719-0TF</router-link>)</h3>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-bronze"></div></div>Doc's space adventure #TS by <router-link to="/teamshell/maker/TheDoctorEpic">TheDoctorEpic</router-link> (<router-link to="/teamshell/level/SBM-KY5-PXG">SBM-KY5-PXG</router-link>)</h3>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-iron"></div></div>Fortress of Blue #TS #ST by <router-link to="/teamshell/maker/cheese_chicken3">cheese_chicken3</router-link> (<router-link to="/teamshell/level/W2S-2QY-6CG">W2S-2QY-6CG</router-link>)</h3>
      <h3><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-iron"></div></div>Hindenburg by thehomiestan by <router-link to="/teamshell/maker/thehomiestan">thehomiestan</router-link> (<router-link to="/teamshell/level/JQM-P15-3XF">JQM-P15-3XF</router-link>)</h3>
      <h2 style="margin-top:10px;margin-bottom:10px;" class="teamshell-primary-fg">Honorable Mentions</h2>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Crowd Favourite</span> - Purple Haze #ST #TS by <router-link to="/teamshell/maker/TheAnswer">TheAnswer</router-link> (<router-link to="/teamshell/level/XG0-719-0TF">XG0-719-0TF</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Best Night Airship</span> - Fortress of Blue #TS #ST by <router-link to="/teamshell/maker/cheese_chicken3">cheese_chicken3</router-link> (<router-link to="/teamshell/level/W2S-2QY-6CG">W2S-2QY-6CG</router-link>) and Hindenburg by <router-link to="/teamshell/maker/thehomiestan">thehomiestan</router-link> (<router-link to="/teamshell/level/JQM-P15-3XF">JQM-P15-3XF</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Best Night Forest</span> - Purple Haze #ST #TS by <router-link to="/teamshell/maker/TheAnswer">TheAnswer</router-link> (<router-link to="/teamshell/level/XG0-719-0TF">XG0-719-0TF</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Best Night Desert</span> - Welcome to Midair Canyon by <router-link to="/teamshell/maker/Trakkan">Trakkan</router-link> (<router-link to="/teamshell/level/1MK-T1C-XGG">1MK-T1C-XGG</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Best Night Sky</span> - Doc's space adventure #TS by <router-link to="/teamshell/maker/TheDoctorEpic">TheDoctorEpic</router-link> (<router-link to="/teamshell/level/SBM-KY5-PXG">SBM-KY5-PXG</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Best Night Ground</span> - Purple Pandemic | #TeamShell #ST by <router-link to="/teamshell/maker/CGIronfist">CGIronfist</router-link> (<router-link to="/teamshell/level/JGP-DY4-VWG">JGP-DY4-VWG</router-link>)</h4>
      <h4><div class="medal" style="margin-right:10px;padding-top: 0px;"><div class="coin coin-shell"></div></div><span :class="$route.params.team + '-secondary-fg'">Best Night Ghost House</span> - Spotlight #TeamShell #ST by <router-link to="/teamshell/maker/geno">geno</router-link> (<router-link to="/teamshell/level/5HQ-9FD-YPF">5HQ-9FD-YPF</router-link>)</h4>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'ShellAndTell',
    data() {
      return {
      };
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
