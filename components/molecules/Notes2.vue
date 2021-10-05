<template>
  <v-card flat style="height:100%;" class="sub pa-0" color="rgba(255, 255, 255, 0)">
    <v-row>
      <v-col md="12" class="px-0 pb-0" v-for="(sentence,index) in sentences" :key="index">
        <v-card flat outlined>
          <v-card-title>
            {{sentence.product_name}} - {{sentence.headline_name}}
          </v-card-title>
          <v-card-text>
            {{sentence.value}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
<style>
.sub .v-window {
  height:100%;
  overflow: auto;
}
.sub .v-input__control,  .sub .v-input__slot{
  height:100%;
}
.sub .v-textarea textarea{
  height:100%;
}
</style>
<script>

export default {
  data: function (){
    return{
    }
  },
  props: ['notebook','cluster','sentences'],
  components: {
  },
  watch: {
  },
  methods: {
  },
  computed: {
    setHeadlines:{
      get() {
        var headlines = []
        return headlines
      },
      set(val) {
      }
    },
    setSentences:{
      get() {
        var sentences = []
        return sentences
      }
    },
  },
  updated: function(){
  },
  destroyed: function(){
  },
  created: function(){
  },
  mounted: function(){
  }
}
</script>
