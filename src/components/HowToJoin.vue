<template>
  <div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-maker-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <p class="mt-2 mb-0">
            Currently the setup process is still pretty much work for us so we can only do bigger or well-known teams (for now).
          </p>
          <p class="mt-2 mb-0">
            If you have a smaller team that you're trying to get big enough, you can message us and we can put you in the smaller teams list on the main page to help you grow a little bit.
          </p>
          <p class="mt-2 mb-0">
            If you already have a bigger or well-known team and you are interested in getting your team hosted so you have your very own level list and discord bot, here is how it works.
          </p>
        </div>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-mini-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h4>Step #1 - You get some stuff together and throw it our way so we can do the initial setup</h4>
        </div>
      </div>
      <div class="bs-callout bs-callout-mini-teams bs-callout-content">
        <ul class="bot-command-list list-group">
          <li class="list-group-item">
            <h5 class="mb-0">The Team Logo (preferrably transparent png, but backgrounds are no problemo)</h5>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">The primary and secondary color (we're gonna use these pretty much everywhere on your personal site, like the orange and buzzy green we from #TeamShell got)</h5>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">The text description you want to be displayed on the makerteams page</h5>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">Your discord link</h5>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">Your team twitter account name (for the feed on the homepage of your team site)</h5>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Some config stuff</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <p>Mod votes needed for approval/rejection (we have 3 in TeamShell, but TeamJamp has 1)</p>
              </li>
              <li class="list-group-item">
                <p>Minimum clear points required for first level upload (for example TeamShell uses 10, TeamJamp uses 0)</p>
              </li>
              <li class="list-group-item">
                <p>Clear point requirements after that for each additional level (for example TeamShell uses 5, Teamjamp uses 0)</p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">The ranks you want and how much clearpoints each one needs, you can also create a custom pip and a discord role for each one (which each user can get themselves assigned with a command so they got their rank color and channels etc...)</h5>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">How much clear points each difficulty level is worth (TeamShell is going in a curve up from 0.5-10 diff and 0.5-20 points, TeamJamp is currently doing 1:1)</h5>
          </li>
        </ul>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-maker-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h4>Step #2 - You let us invite the bot to your discord, so it can create all the necessary channels</h4>
        </div>
      </div>
      <div class="bs-callout bs-callout-maker-teams bs-callout-content">
        <p class="mt-2 mb-0">
          At the moment the bot is not public so you need to give temporary admin rights to a_unique_id so he can add the bot to your server.
        </p>
        <p class="mt-2 mb-0">
          You can take away the admin rights right after that again, but in general it would be nice to have some kind of role to get access to the text-channels so you can ping us if you find a bug.
        </p>
        <p class="mt-2 mb-3">
          Here are the channels that the bot will create for you.
        </p>
        <ul class="bot-command-list list-group">
          <li class="list-group-item">
            <h5 class="mb-0">#bot-mod-channel</h5>
            <p class="mt-2 mb-0">
              This is the channel for the mods where they can use moderator-specific bot commands like approve or rerate. This should only be readable and writeable for your mods.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">#bot-makerteam-initiation</h5>
            <p class="mt-2 mb-0">
              After the first level of a member gets approved, an initiation message gets posted here and they get the member discord role. This should be visible to all, but unwritable.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">#bot-level-updates</h5>
            <p class="mt-2 mb-0">
              This is where level approvals, fix requests, rejections and reratings get posted. The notifications will ping the creator of the level. This should be visible to all, but unwritable.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">#bot-command-feed</h5>
            <p class="mt-2 mb-0">
              This is where clears and likes from the webpage get posted, the clearer of the level will be pinged here. This should be visible to all, but unwritable.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">#bot-pending-discussion</h5>
            <p class="mt-2 mb-0">
              This is a category channel where text channels for pending levels will be created that have started their judgement. That is where your mods can discuss about what to do with a certain level and should only be visible and writeable to them.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">#bot-pending-reupload</h5>
            <p class="mt-2 mb-0">
              This is a category channel where text-channels for reuploads or fix requests will be created. This should only be visible and writeable to your mods.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-0">#bot-makerteam-feedback</h5>
            <p class="mt-2 mb-0">
              This is where anonymous feedback for the mods gets posted. Who made the post will not be saved but it should show you with an id if a post has been made by the same person. This should be visible only to mods and not writeable.
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-mini-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h4>Step #3 - Then you rename and sort the channels and set all your wanted permissions</h4>
        </div>
      </div>
      <div class="bs-callout bs-callout-mini-teams bs-callout-content">
        <p>
          You can rename the channels and set all the permissions how you want them, but please don't take any necessary permissions away from the bot role.
        </p>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-maker-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h4>Step #4 - After that you throw the bot out of all channels where you don't want commands to work</h4>
        </div>
      </div>
      <div class="bs-callout bs-callout-maker-teams bs-callout-content">
        <p>
          For all the normal chat channels where you don't want the bot to react to a command (to prevent the command spam there), you can just take read permissions from the bot role.
        </p>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-mini-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h4>Step #5 - Finally you can go through the messages the bot throws out there to add your own touch to the bots replies (like your server emotes, etc...)</h4>
        </div>
      </div>
      <div class="bs-callout bs-callout-mini-teams bs-callout-content">
        <p>
          We'll send you a google sheet where you can replace the messages the bot uses to give them your own touch. If you want to add a server emote, post the emote somewhere and put a backslash (\) before it, you should get the actual code of the emote then so you can just copy the whole thing into the messages (without the backslash)
        </p>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-maker-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <p class="mt-2 mb-0">
            And *Bam* you're done. All the commands (you can check out the features page) should work and your very own level list right here on the page should be accessible.
          </p>
          <p class="mt-2 mb-0">
            You can just link your members the main page of your team site, the absolute basics of how to join/submit levels/clear levels should be explained there.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HowToJoin',
    components: {
    },
    data() {
      return {
      };
    },
    mounted(){
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
