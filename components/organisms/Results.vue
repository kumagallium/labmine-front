<template>
  <v-card flat style="height:100%;" class="sub">
    <v-tabs :show-arrows="false" id="proptabs" vertical color="indigo" background-color="indigo lighten-5" style="height:100%;" v-model="tab">
      <v-tab style="width:150px;" v-if="!notebook || details.figures.filter(fg => fg.is_condition == this.is_condition)[0]['figure_name']!==''">
        Numerical
      </v-tab>
      <v-tab style="width:150px;">
        Non-numerical
      </v-tab>
    
      <v-tab-item style="height:100%;overflow: hidden;background-color:#fafafa;" eager  v-if="!notebook || details.figures.filter(fg => fg.is_condition == this.is_condition)[0]['figure_name']!==''">
        <v-card outlined flat v-for="(val, idx) in details.figures.filter(fg => fg.is_condition == this.is_condition)" :key="idx" class="ma-2 figure" @click="selectedFig(idx)" :ripple="false" style="cursor: default;">
          <v-row>
            <v-col md="12" class="pt-0 pb-0" style="text-align:right;">
              <v-card outlined color="#f5f5f5" class="mt-2 mr-2 pl-2 pr-2 d-inline-block" style="width:fit-content;border-radius:50px;font-size: 0.9em;" v-if="boxid">
                BrockID: {{boxid}}
              </v-card>
              <v-card outlined color="#f5f5f5" class="mt-2 mr-2 pl-2 pr-2 d-inline-block" style="width:fit-content;border-radius:50px;font-size: 0.9em;" v-if="val.id">
                FigureID: {{val.id}}
              </v-card>
            </v-col>
          </v-row>
          <v-row style="width:100%;height:70px;" class="ml-0 mr-0">
            <v-col md="6">
              <v-text-field :disabled="notebook" label="Name" height="20px" :value="val['figure_name']" outlined dense v-on:keyup="inputFigurename"
                :error-messages="Object.keys(error).indexOf('figure_name') !== -1 ? [error['figure_name'][0]] : []"
              ></v-text-field>
            </v-col>
            <v-col md="5">
              <v-select :disabled="notebook" v-model="selecttype[idx]" :items="typelist" label="Datatype" outlined dense v-on:change="changeType">""</v-select>
            </v-col>
            <v-col v-if="!notebook" md="1" class="pl-1 pt-4">
              <v-btn x-small text color="indigo lighten-4" @click="deleteProp(is_condition,val,idx)">
                Delete <br>  prop {{idx+1}}
              </v-btn>
            </v-col>
              
          </v-row> 
          <v-row style="width:100%;height:calc(100% - 70px);" class="ml-0 mr-0">
            <v-col md="12">
              <ScatterPlot :is_condition="is_condition" v-if="typelist[val['datatype']]=='ScatterPlot'" :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == val['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figure="val" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></ScatterPlot>
              <LineChart  :is_condition="is_condition" v-if="typelist[val['datatype']]=='LineChart'"   :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == val['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figure="val" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></LineChart>
              <Onedim  :is_condition="is_condition" v-if="typelist[val['datatype']]=='One-dimension'"   :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == val['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figure="val" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></Onedim>
            </v-col>
          </v-row>
        </v-card>
        <v-card v-if="!notebook" flat class="ma-2" color="rgb(0, 0, 0, 0.0)">
          <v-btn depressed color="#fafafa;" @click="addProperty" style="width:100%;height:100%;">
            <v-icon dark>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-card>
      </v-tab-item>
      <v-tab-item style="height:100%;overflow: hidden;background-color:#fafafa;" eager>
        <v-card outlined flat class="ma-2">
          <Products :is_condition="is_condition" :dataedit="dataedit" :defaults="defaults" :descriptions="descriptions" :items="items" v-on:changedDescriptions="changedDescriptions" v-on:addItems="addItems" v-on:removeItems="removeItems" :notebook="notebook"></Products> 
        </v-card>
      </v-tab-item>
    </v-tabs>
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
.figure:before{
  background:white;
}
</style>
<script>
import ScatterPlot from '~/components/molecules/ScatterPlot.vue'
import LineChart from '~/components/molecules/LineChart.vue'
import Products from '~/components/molecules/Products.vue'
import Onedim from '~/components/molecules/Onedim.vue'

export default {
  data: function (){
    return{
      tab:0,
      figureidx:0,
      selecttype:[],
      datatmp:[],
      typelist:["ScatterPlot","LineChart","One-dimension"]
    }
  },
  props: ['definitions','details','notebook','dataedit','datalist','boxid','entityid','error','items','descriptions','defaults','is_condition'],
  components: {
    ScatterPlot,
    LineChart,
    Products,
    Onedim,
  },
  watch: {
    details: function () {
      this.selecttype = []
      for(var df of this.details.figures.filter(fg => fg.is_condition == this.is_condition)){
        this.selecttype.push(this.typelist[df['datatype']])
      }
    }
  },
  methods: {
    addProperty: function (e) {
      this.figureidx = this.details.figures.filter(fg => fg.is_condition == this.is_condition).length
      this.selecttype.push("ScatterPlot")
      this.$emit('addProperty',this.details.figures.filter(fg => fg.is_condition == this.is_condition).length);
    },
    inputFigurename: function(e){
      this.$emit('changeFigurename',this.figureidx, e.target.value);
    },
    changeProperty: function(properties){
      this.$emit('changeProperty',this.figureidx, properties);
    },
    changedData: function(data){
      console.log("changedData")
      console.log(data)
      this.$emit('changedData', data);
    },
    deleteProp: function(is_condition,figure,idx){
      this.$emit('deleteProp',idx,figure,is_condition);
    },
    changeType: function(type){
      this.$emit('changeType',this.figureidx, this.typelist.indexOf(type));
    },
    selectedFig: function(idx){
      console.log("selectedFig",idx)
      this.figureidx = idx
    },
    addItems: function(val){
      this.$emit('addItems',val);
    },
    removeItems: function(val){
      this.$emit('removeItems',val);
    },
    changedDescriptions: function(itemid,descriptions){
      this.$emit('changedDescriptions',itemid,descriptions);
    },
  },
  updated: function(){
    console.log("updated(prop)")
    if(this.figureidx==undefined)this.figureidx=0
    if(this.figureidx>=this.details.figures.filter(fg => fg.is_condition == this.is_condition).length){
      this.figureidx = 0
    }
    //this.propnum = this.details.figures.length
  },
  destroyed: function(){
    console.log("destroyed")
  },
  created: function(){
    console.log("created(prop)")
  },
  mounted: function(){
    console.log("mounted(prop)")
    this.selecttype = []
    for(var df of this.details.figures.filter(fg => fg.is_condition == this.is_condition)){
      console.log(df['datatype'])
      this.selecttype.push(this.typelist[df['datatype']])
    }
  }
}
</script>
