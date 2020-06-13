<template>
    <div class="custom-view-wrapper">
        <h2 v-if="edit" class="dg-title">Edit Race</h2>
        <h2 v-if="!edit" class="dg-title">Add new Race</h2>

        <div class="dg-content">
          <div class="form-group row">
            <div class="col-12">
              <label for="name">Race Name</label>
              <input name="name" type="text" class="form-control" autocomplete="off" placeholder="Race Name" v-model="name">
              <small class="form-text text-muted">The name you want to set for the race.</small>
            </div>
            <div class="col-6 mt-3">
              <label for="startDate">Start Date</label>
              <datetime v-model="startDate" :value="startDate" name="startDate" placeholder="Start Date" format="YYYY-MM-DD H:i" readonly="readonly"></datetime>
              <small class="form-text text-muted">The date and time of when the race should start.</small>
            </div>
            <div class="col-6 mt-3">
              <label for="length">Race Length</label>
              <input name="length" type="text" class="form-control" autocomplete="off" placeholder="Race Length" v-model="length">
              <small class="form-text text-muted">The length of the race in minutes.</small>
            </div>
            <div class="col-6 mt-3">
              <label for="raceType">Race Type</label>
              <select name="raceType" v-model="raceType" class="form-control">
                <option value="FC" selected>First Clear Race</option>
                <option v-if="false" value="WR">World Record Race</option>
              </select>
              <small class="form-text text-muted">What kind of race it should be.</small>
            </div>
            <div class="col-6 mt-3">
              <label for="levelType">Level Selection</label>
              <select name="levelType" v-model="levelType" class="form-control">
                <option value="random-uncleared" selected>Random Uncleared (of all participants)</option>
                <option value="random">Random All</option>
                <option value="specific">Specific Level (hidden until start)</option>
              </select>
              <small class="form-text text-muted">How the level for the race should be selected. If no level can be found, the race will be postponed.</small>
            </div>
            <div class="col-12" v-show="levelType == 'specific'">
              <label for="levelCode">Level Code</label>
              <input name="levelCode" type="text" class="form-control" autocomplete="off" placeholder="Level Code" v-model="levelCode">
              <small class="form-text text-muted">The ingame code of the specific level you want to use for the race.</small>
            </div>
            <div class="col-12" v-show="levelType != 'specific'">
              <label for="difficultyRange">Difficulty Range</label>
                <div class='race-dialog-diff-range-container'>
                  <div id='race-dialog-difficulty-range-slider'></div>
                </div>
              <small class="form-text text-muted">The difficulty range in which to look for a random level.</small>
            </div>
            <div class="col-6 mt-3" v-show="levelType != 'specific'">
              <label for="levelTag">Tags</label>
              <select name="levelTag" v-model="levelTag" class="form-control">
                <option :value="null" selected>All</option>
                <option v-for="tag in tags" :key="tag.id" :value='tag' >Shell And Tell</option>
              </select>
              <small class="form-text text-muted">Use this to only select levels with a certain tag.</small>
            </div>
            <div class="col-6 mt-3" v-show="levelType != 'specific'">
              <label for="submissionTimeType">Submission Time</label>
              <select name="submissionTimeType" v-model="submissionTimeType" class="form-control">
                <option value="all" selected>All</option>
                <option value="month">Within the last 30 days</option>
                <option value="week">Within the last 7 days</option>
              </select>
              <small class="form-text text-muted">Use this to only select levels that have been recently submitted.</small>
            </div>
          </div>
        </div>
        <div class="dg-footer">
          <button type="button" class="btn btn-circle new-race-dialog-button" :class="messageBody + '-primary-bg'" title="Create Race" v-on:click="handleOk()"><i class="fa fa-check"></i></button>
          <button type="button" class="btn btn-circle new-race-dialog-button" :class="messageBody + '-primary-bg'" title="Cancel" v-on:click="handleDismiss()"><i class="fa fa-times"></i></button>
        </div>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';
import datetime from 'vuejs-datetimepicker';
import noUiSlider from 'nouislider';
import moment from 'moment';

import 'nouislider/distribute/nouislider.css';

export default {
  mixins: [DialogMixin],
  data(){
    return {
      name: null,
      startDate: null,
      endDate: null,
      raceType: "FC",
      levelType: "random-uncleared",
      levelCode: null,
      levelTag: null,
      submissionTimeType: "all",
      tags: [],
      edit: false,
      raceId: null,
      length: 60,
    };
  },
  mounted(){
    let slider = document.getElementById('race-dialog-difficulty-range-slider');

    let formatNumber = {
      to: function(number){
        return number.toFixed(1);
      },
      from: function(text){
        return parseFloat(text);
      }
    }

    noUiSlider.create(slider, {
        start: [0.5, 11],
        connect: true,
        tooltips: [formatNumber, formatNumber],
        range: {
            'min': 0.5,
            'max': 11
        },
        step: 0.5,
        pips: {
            mode: 'values',
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            density: 4
        }
    });

    if(this.options.race){
      slider.noUiSlider.set([this.options.race.level_filter_diff_from.toFixed(2), this.options.race.level_filter_diff_to.toFixed(2)]);

      this.name = this.options.race.name;
      this.startDate = moment(this.options.race.start_date).format("YYYY-MM-DD HH:mm");
      this.endDate = moment(this.options.race.end_date).format("YYYY-MM-DD HH:mm");
      this.raceType = this.options.race.race_type;
      this.levelType = this.options.race.level_type;
      if(this.options.race.level){
        this.levelCode = this.options.race.level.code;
      }
      if(this.options.race.level_filter_tag){
        this.levelTag = this.options.race.level_filter_tag;
      }
      this.submissionTimeType = this.options.race.level_filter_submission_time_type;

      this.length = moment.duration(moment(this.options.race.end_date).diff(moment(this.options.race.start_date))).asMinutes();

      this.edit = true;
      this.raceId = this.options.race.id;
    } else {
      this.startDate = moment().format("YYYY-MM-DD HH:mm");
    }
    if(this.options.tags){
      this.tags = this.options.tags;
    }
  },
  methods: {
    handleOk() {
      let slider = document.getElementById('race-dialog-difficulty-range-slider');
      let diffs = slider.noUiSlider.get();

      this.endDate = moment(this.startDate, "YYYY-MM-DD HH:mm").add(this.length, 'minute').format("YYYY-MM-DD HH:mm");

      let raceData = {
        "name": this.name,
        "startDate": this.startDate,
        "endDate": this.endDate,
        "raceType": this.raceType,
        "levelType": this.levelType,
        "levelCode": this.levelCode,
        "submissionTimeType": this.submissionTimeType,
        "minDifficulty": parseFloat(diffs[0]).toFixed(1),
        "maxDifficulty": parseFloat(diffs[1]).toFixed(1)
      };

      if(this.levelTag){
        raceData["levelTagId"] = this.levelTag.id;
      }

      if(this.edit){
        raceData["id"] = this.raceId;
      }

      this.proceed(raceData);
    },
    handleDismiss() {
      this.cancel();
    }
  },
  components: {
    datetime
  }
};
</script>

<style scoped="">
</style>