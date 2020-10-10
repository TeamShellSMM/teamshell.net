<template>
    <div class="custom-view-wrapper">
        <p>
          Your saved data was cleared (Default filtering, logins, etc...).
        </p>
        <p>
          If you tried this because the page didn't load anymore it would help us out a lot if you could click the button and send the data to Liaf or unique_id :)
        </p>

        <button class="btn btn-block makerteams-secondary-bg" style="color:white;" @click="handleClipboard()">Copy data to clipboard.</button>
        <button class="btn btn-block makerteams-secondary-bg" style="color:white;" @click="handleDismiss()">Close & Reload</button>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';

export default {
  mixins: [DialogMixin],
  data() {
    return {
      copiedStorage: null
    };
  },
  mounted(){
    this.copiedStorage = JSON.stringify(localStorage);
    localStorage.clear();
  },
  methods: {
    handleClipboard() {
      const el = document.createElement('textarea');
      el.value = this.copiedStorage;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    },
    handleDismiss() {
      this.proceed(this.platform);
    },
  }
};
</script>

<style scoped="">
button {
  width: 100%;
  margin-bottom: 10px;
  float: none;
}
</style>