<template>
  <div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-maker-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h2>Maker Teams is a site that helps Mario Maker 2 Teams organize their level list</h2>
          <h3>These are the features you can use if your team is hosted here</h3>
          <p class="mt-2 mb-0">
            If this is all a bit much for you and you just want to get cracking we marked the most important commands and features for you in red.
          </p>
          <p class="mt-2 mb-0">
            You can use any of the bot-commands in the discord text-channel designated for bot commands (for example #misc-commands or #bot-spam), just leave the pointy brackets away.
          </p>
        </div>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-mini-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h4>Here's what you can do with the bot if you're a member of a team</h4>
        </div>
      </div>
      <div class="bs-callout bs-callout-mini-teams bs-callout-content">
        <ul class="bot-command-list list-group">
          <li class="list-group-item">
            <h5 class="mb-3">Registering and adding your maker id</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item bot-command-important">
                <span class="bot-command-text">!register &lt;Name&gt;</span>
                <p>
                  You'll have to do this in the beginning to register with your preferred name (it's gonna show up on the site and everywhere)
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!makerid &lt;XXX-XXX-XXX&gt;</span>
                <p>
                  This saves your maker id so we can show it on your page in the future (and for other future stuff like worlds, etc..)
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Submitting levels</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item bot-command-important">
                <span class="bot-command-text">!add &lt;XXX-XXX-XXX&gt; &lt;Level Name&gt;</span>
                <p>
                  As soon as you have the required clearpoints (it depends on your team how much that is) you can submit a level to the moderators with this. You'll get a notification if it's approved, still needs some fixes or if it doesn't fit the team.
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Reuploading, removing or renaming levels</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item bot-command-important">
                <span class="bot-command-text">!reupload &lt;XXX-XXX-XXX&gt; &lt;XXX-XXX-XXX&gt; &lt;Reason&gt;</span>
                <p>
                  Use this after you reuploaded a level (first the old code, then the new code and then a little text for the mods and everybody, so they know why you reuploaded) to make some fixes, if the level was already approved or if you got a fix request for it, the level doesn't have to be reapproved and goes straight into it's own little queue for the mods to look at it.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!removelevel &lt;XXX-XXX-XXX&gt; &lt;Reason&gt;</span>
                <p>
                  Use this only if you want to permanently remove your level from the list, if you want to reupload use the reupload command.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!rename &lt;XXX-XXX-XXX&gt; &lt;New Level Name&gt;</span>
                <p>
                  With this you can rename one of your submitted levels.
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Finding out the status of your levels that are currently pending to be approved</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!levelstatus &lt;XXX-XXX-XXX&gt;</span>
                <p>
                  With this you can find out the status of one of your levels that's currently pending.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!pending</span>
                <p>
                  Same as above but it shows you the status of all your pending levels.
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Tracking clears and likes (keep in mind that if you lie about your clears you will be banned from the team)</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item bot-command-important">
                <span class="bot-command-text">!clear &lt;XXX-XXX-XXX&gt;</span>
                <p>
                  With this command you can flag any level as cleared by you. You'll get clearpoints depending on how difficult the level was (get enough to earn higher ranks).
                </p>
              </li>
              <li class="list-group-item bot-command-important">
                <span class="bot-command-text">!clear &lt;XXX-XXX-XXX&gt; like</span>
                <p>
                  The same command as the one above but you also submit a like for the level. Likes give the maker of the level more maker points than just clears, so if you did enjoy a level, don't forget to leave a like!
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!removeclear &lt;XXX-XXX-XXX&gt;</span>
                <p>
                  With this you can remove your clear if you accidentally put in the wrong code.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!like &lt;XXX-XXX-XXX&gt;</span>
                <p>
                  With this you can submit just a like on a level you've cleared (in case you forgot to add it with the clear or if you changed your mind)
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!unlike &lt;XXX-XXX-XXX&gt;</span>
                <p>
                  Use this to remove your like if you did it by accident.
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Checking your clear points and getting your rank roles</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item bot-command-important">
                <span class="bot-command-text">!points</span>
                <p>
                  This shows you how many clearpoints you have currently accumulated (if a level's difficulty changes your points will be automatically updated). It also shows you if you got enough points to upload a level and which rank you have currently reached.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!points role</span>
                <p>
                  Use this to get the discord role of your currently reached rank (to get access to rank specific channels and to get your name in the rank color)
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!points norole</span>
                <p>
                  Use this to remove the discord role of your currently reached rank
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Adding tags or clearvids to a level</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!addtags &lt;XXX-XXX-XXX&gt; &lt;tag1,tag2,tag3,...&gt;</span>
                <p>
                  Use this to add missing tags to a level (like SMB1, SMW, etc...)
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!removetags &lt;XXX-XXX-XXX&gt; &lt;tag1,tag2,tag3,...&gt;</span>
                <p>
                  You can use this to remove a tag from one of your own levels (or from all levels if you're a mod)
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!addvids &lt;XXX-XXX-XXX&gt; &lt;link1,link2,link3,...&gt;</span>
                <p>
                  Use this to add a clearvid to a level (it's gonna get shown on the page or with !info)
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!removevids &lt;XXX-XXX-XXX&gt; &lt;link1,link2,link3,...&gt;</span>
                <p>
                  With this you can remove clearvids from your own levels	(or from all levels if you're a mod)
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Getting all the infos on a level</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!info &lt;XXX-XXX-XXX&gt;</span>
                <p>
                  This shows you all the relevant information for a certain level (Name, Tags, Clearvids, etc..)
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Getting a random level to play</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!random</span>
                <p>
                  Randomly chooses a level you haven't cleared yet for you to play. It tries to find stuff in your difficulty range and uses the maximum difficulty you ever cleared as the limit.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!random &lt;minDifficulty&gt;</span>
                <p>
                  Same as above but you can manually set the minimum difficulty you want (like 1.0)
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!random &lt;minDifficulty&gt; &lt;maxDifficulty&gt;</span>
                <p>
                  Same as above but you can also set the maximum difficulty you want (like from 1.0 to 3.0)
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!playersRandom &lt;name1,name2,name3&gt; &lt;mindifficulty&gt; &lt;maxDifficulty&gt;</span>
                <p>
                  Same as above, but with this one you can put in multiple players to find a level you all haven't cleared yet (in case you want to race each other or play together)
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Login on the webpage</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item bot-command-important">
                <span class="bot-command-text">!login</span>
                <p>
                  After you use this command the bot will dm you a link you can use to login on the website (to submit your clears and likes there). IMPORTANT: If you're on mobile please copy the link and add it manually to your browser to keep the login. If you just click it, discord might open a temporary browser window for you where you can't log in permanently.
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-maker-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h4>Here's what you can do with the site if you're a member of a team</h4>
        </div>
      </div>
      <div class="bs-callout bs-callout-maker-teams bs-callout-content">
        <ul class="bot-command-list list-group">
          <li class="list-group-item bot-command-important">
            <h5 class="mb-2">Check the level list</h5>
            <p class="mb-2">
              You can always check out and filter the current level list of the team. You can see the level code, name, difficulty, Like-Clear-Diff Score, clear vids, tags and much more there.
            </p>
            <p class="mb-0">
              You can check out the Level Detail Page by clicking on the code (to check out the clears) or check out the Maker Detail Page by clicking the Creator Name (to check out their other levels).
            </p>
          </li>
          <li class="list-group-item bot-command-important">
            <h5 class="mb-2">Submit your clears</h5>
            <p class="mb-0">
              After logging in (with !login) you can instantly clear or like a level from the list by clicking on the checkmark or heart symbol on the right side.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-2">Get a random uncleared level to play</h5>
            <p class="mb-0">
              After logging in (with !login) you can press the random button on the top right to get taken to a random level you haven't cleared yet.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-2">Submit some feedback</h5>
            <p class="mb-0">
              After logging in (with !login) you can click your name on the top right and click "Submit Feedback" to submit anonymous feedback to the moderators of the team.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-2">Checking out the Maker Leaderboard</h5>
            <p class="mb-0">
              You can check out the current maker leaderboard under "Makers" right up on top. You can filter by seasons to see who has made the levels that got the most Like-Clear-Diff Points, the most likes/clears or the highest like/clear-ratio over a certain time period.
            </p>
          </li>
          <li class="list-group-item">
            <h5 class="mb-2">Checking out the Player Leaderboard</h5>
            <p class="mb-0">
              You can check out the current player leaderboard under "Members" right up on top. Here you can see who has gotten the most clear points or who cleared the most levels.
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="row mb-2 feature-box">
      <div class="bs-callout bs-callout-mini-teams bs-callout-title">
        <div class="bs-callout-title-box">
          <h4>Here's what you can do with the bot if you're a mod</h4>
        </div>
      </div>
      <div class="bs-callout bs-callout-mini-teams bs-callout-content">
        <ul class="bot-command-list list-group">
          <li class="list-group-item">
            <h5 class="mb-2">Starting the judgement for a level.</h5>
            <p class="mb-2">
              When a level gets submitted it gets added to the list as "pending". You can use any of these commands in the moderator bot-command text-channel to start the judgement process. IMPORTANT: The quotes at the end of these commands (for the message) are important at the moment, don't forget to close the brackets and try to use the straight brackets (the wavy ones don't work atm).
            </p>
            <p class="mb-3">
              The approve and fix commands can be used with a modifier at the end of the command itself, +c if you want to add a clear and +cl if you want to add a clear and a like (i.e. !approve+c, !fix+cl)
            </p>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!approve &lt;XXX-XXX-XXX&gt; &lt;Difficulty&gt; "&lt;Reason and other comments for the level&gt;"</span>
                <p>
                  This submits an approval vote from you for this level with the specified difficulty. If this is the first moderator vote (of any kind) for this level, the judgement process gets started and a text-channel will be created for this level in the pending level-discussion category.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!fix &lt;XXX-XXX-XXX&gt; &lt;Difficulty&gt; "&lt;Reason and other comments for the level&gt;"</span>
                <p>
                  This counts as an approval vote for most purposes, but if the level gets approved and there's at least one Fixvote on it the creator will get a fix request and he can decide if he wants to reupload the level or not. Either way it will go into it's separate queue (in the category channel "pending-reuploads" where the mods can decide if it's still alright to approve or not. Try to put into your "reason" which of the fixes are mandatory and which are optional for you.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!reject &lt;XXX-XXX-XXX&gt; "&lt;Reason and other comments for the level&gt;"</span>
                <p>
                  This submits a reject vote for this level. This should only be used if the level does not fit the team, if it's completely unfixable or if you can't assign a difficulty for some reason (too frustrating to complete, etc...).
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-2">Adding votes to a level where the judgement process has already started</h5>
            <p class="mb-2">
              You can use these commands just like the other three, but in the discussion channel of a level that's already in judgement
            </p>
            <p class="mb-3">
              All of these are the same as as the ones above, except that you don't have to put in the code (the bot gets that from the text-channel you're in)
            </p>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!approve &lt;Difficulty&gt; "&lt;Reason and other comments for the level&gt;"</span>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!fix &lt;Difficulty&gt; "&lt;Reason and other comments for the level&gt;"</span>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!reject "&lt;Reason and other comments for the level&gt;"</span>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Judging a level</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!judge</span>
                <p>
                  Use this in a judgement channel for a level that has reached the needed amount of mod votes to finalize the judgement process. The level creator gets a notification (with all the votes and reasons) in the level update text-channel and the level gets immediately approved, rejected or goes into a fix request (if it's approved and there's at least one fix vote)
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-2">Instantly approving (or in edge cases rejecting) reuploads</h5>
            <p class="mb-3">
              Reuploads of approved levels or levels that got a fix request through judgement and have been reuploaded or where the creator refused to reupload get put in the pending-reuploads category for a final look at if the changes have been made or if it's still ok to approve. Use these commands to decide the fate of that level.
            </p>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!fixapprove</span>
                <p>
                  To instantly approve the level.
                </p>
              </li>
              <li class="list-group-item">
                <span class="bot-command-text">!fixreject</span>
                <p>
                  To instantly reject the level.
                </p>
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <h5 class="mb-3">Rerating the difficulty of levels</h5>
            <ul class="bot-command-list list-group">
              <li class="list-group-item">
                <span class="bot-command-text">!rerate &lt;XXX-XXX-XXX&gt; &lt;Difficulty&gt; "&lt;Reason&gt;"</span>
                <p>
                  Use this to rerate the difficulty of a level (in case it's outdated or has been wrongly approved with a too high or or too low difficulty). The Creator of the level will get a notification with your reason.
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Features',
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
