<template>
  <v-card flat style="height:100%;" class="sub">
    <v-row>
      <v-col>
        <v-combobox
          v-model="setHeadlines"
          :items="this.headlines != undefined ? this.headlines.map(it => it.fields.headline_name):[]"
          label="Headlines"
          multiple
          outlined
          dense
          small-chips
          hide-details
          :disabled="(!dataedit)&&!(cluster==0)"
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row v-for="(headline,idx) in setHeadlines" :key="idx">
          <v-col md="4" style="text-align:right;" class="pt-5">
            {{headline}} :
          </v-col>
          <v-col md="8" class="pl-0">
            <v-textarea
              v-model="setSentences[idx]"
              outlined
              hide-details
              @change="changedSentences($event,headline)"
              :disabled="(!dataedit&&!(cluster==0))"
            ></v-textarea>
          </v-col>
        </v-row>
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
      selectedheadlines:[],
      defaults:[]
    }
  },
  props: ['headlines','sentences','dataedit','cluster'],
  components: {
  },
  watch: {
  },
  methods: {
    changedSentences: function(sentences,headline){
      if(this.headlines.filter(it => it.fields.headline_name == headline).length > 0){
        this.$emit('changedSentences',this.headlines.filter(it => it.fields.headline_name == headline)[0].pk,sentences,this.cluster);
      }
      else{
        this.$emit('changedSentences',headline,sentences,this.cluster);
      }
    },
  },
  computed: {
    setHeadlines:{
      get() {
        var headlines = []
        if(this.sentences != undefined){
          var sentence_tmp = this.sentences.filter(it => it.fields.cluster == this.cluster).map(it => it.fields.headline_name)
          var add_sentences = this.defaults.filter(dt => sentence_tmp.indexOf(dt)<0)
          headlines = sentence_tmp.concat(add_sentences)
        }
        return headlines
      },
      set(val) {
        var sentence_tmp = this.sentences.filter(it => it.fields.cluster == this.cluster).map(it => it.fields.headline_name)
        var add_sentences = this.defaults.filter(dt => sentence_tmp.indexOf(dt)<0)
        var headlines = sentence_tmp.concat(add_sentences)

        var add_defaults = val.filter(v => headlines.indexOf(v)<0)
        this.$emit('addHeadlines',add_defaults,this.cluster);

        var remove_defaults_tmp = headlines.filter(dt => val.indexOf(dt)<0)
        var remove_defaults = this.headlines.filter(it => remove_defaults_tmp.indexOf(it.fields.headline_name) >= 0).map(it => it.pk)
        if(sentence_tmp.length > 0){
          var hasvalue = this.sentences.filter(des => des.fields.value.replace(/\r?\n/g,"").replace(" ","").replace("　","") != "").map(des => des.fields.headline)
          remove_defaults = remove_defaults.filter(rd => hasvalue.indexOf(rd) < 0)
        }
        if(remove_defaults.length > 0) this.$emit('removeHeadlines',remove_defaults,this.cluster);
      }
    },
    setSentences:{
      get() {
        var sentences = []
        if(this.sentences != undefined){
          var sentence_tmp = this.sentences.filter(it => it.fields.cluster == this.cluster).map(it => it.fields.headline_name)
          var add_sentences = this.defaults.filter(dt => sentence_tmp.indexOf(dt)<0)
          sentences = this.sentences.map(it => it.fields.value)
          for(var i=0; i < add_sentences.lenghth;i++){
            sentences.push("")
          }
        }
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
