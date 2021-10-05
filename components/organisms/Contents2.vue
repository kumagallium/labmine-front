<template>
  <v-card flat style="height:100%;" class="sub" color="rgba(255, 255, 255, 0)">
    <!-- DescriptionCards -->
    <v-card v-if="summarizeddata.descriptions.length > 0" outlined flat class="ma-2 figure" :ripple="false" style="cursor: default;">
     <v-row style="width:100%;height:100%;" class="ml-0 mr-0">
        <v-col md="12" class="px-0">
          <Description2 
            :cluster="cluster"
            :notebook="notebook"
            :descriptions="summarizeddata.descriptions"
          >
          </Description2> 
        </v-col>
      </v-row>
    </v-card>
    <!-- NoteCards -->
    <v-card v-if="summarizeddata.sentences.length > 0" color="rgba(255, 255, 255, 0)" outlined flat class="ma-2" :ripple="false" style="cursor: default;">
     <v-row style="width:100%;height:100%;" class="ml-0 mr-0">
        <v-col md="12" class="">
          <Notes2 
            :cluster="cluster"
            :notebook="notebook"
            :sentences="summarizeddata.sentences"
          >
          </Notes2> 
        </v-col>
      </v-row>
    </v-card>
    <!-- DataCards -->
    <v-row class="pa-3">
      <v-col cols="6" class="pt-2 px-2 pb-0" v-for="(val, idx) in summarizeddata.figures.filter(fg => fg.datatype < 2).filter(fg => fg.rawdata.filter(rd=>rd.values.length > 0).length>0)" :key="'fig'+idx+'_'+cluster">
        <v-card outlined flat  class="figure" :ripple="false" style="cursor: default;">
          <v-row class="mx-2">
            <v-col md="12" class="px-0 d-flex align-end flex-row-reverse" style="text-align:right;">
              <v-card outlined color="#f5f5f5" class="mt-2 mr-2 px-1 d-inline-block" style="width:fit-content;border-radius:50px;font-size: 0.7em;" v-if="val.figure_id">
                FigureID: {{val.figure_id}}
              </v-card>
            </v-col>
          </v-row>
          <v-row style="width:100%;height:calc(100% - 70px);" class="mt-0 ml-0 mr-0">
            <v-col md="12" class="pt-0">
              <ScatterPlot2 v-if="typelist[val['datatype']]=='ScatterPlot'" :cluster="cluster" :figurename="val['figure_name']" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figure="val" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></ScatterPlot2>
              <LineChart2 v-else-if="typelist[val['datatype']]=='LineChart'" :cluster="cluster" :figurename="val['figure_name']" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figure="val" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></LineChart2>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="6" class="pt-2 px-2 pb-0" v-for="(val, idx) in OnedimFigs" :key="'images'+idx+'_'+cluster">
        <v-card outlined flat  class="figure" :ripple="false" style="cursor: default;">
          <v-row class="mx-2">
            <v-col md="12" class="px-0 d-flex align-end flex-row-reverse" style="text-align:right;">
              <v-card outlined color="#f5f5f5" class="mt-2 mr-2 px-1 d-inline-block" style="width:fit-content;border-radius:50px;font-size: 0.7em;" v-if="val">
                FigureID: {{val}}
              </v-card>
            </v-col>
          </v-row>
          <v-row style="width:100%;height:calc(100% - 70px);" class="mt-0 ml-0 mr-0">
            <v-col md="12" class="pt-0">
              <Onedim2 :cluster="cluster" :figurename="summarizeddata.figures.filter(fig=> fig.figure_id == val)[0]['figure_name']" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figures="summarizeddata.figures.filter(fig=> fig.figure_id == val)" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></Onedim2>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="6" class="pt-4 px-2 pb-0" v-for="image in summarizeddata.images" :key="'image_'+image.imageid+'_'+cluster">
        <Images2 v-if="image" :image="image"></Images2>
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
.figure:before{
  background:white;
}
</style>
<script>
import ScatterPlot2 from '~/components/molecules/ScatterPlot2.vue'
import LineChart2 from '~/components/molecules/LineChart2.vue'
import Description2 from '~/components/molecules/Description2.vue'
import Onedim2 from '~/components/molecules/Onedim2.vue'
import Images2 from '~/components/molecules/Images2.vue'
import Notes2 from '~/components/molecules/Notes2.vue'

export default {
  data: function (){
    return{
      typelist:["ScatterPlot","LineChart","One-dimension"],
    }
  },
  props: ['summarizeddata','definitions','notebook','dataedit','targeterror','items','descriptions','defaults','cluster'],
  components: {
    ScatterPlot2,
    LineChart2,
    Description2,
    Onedim2,
    Images2,
    Notes2
  },
  watch: {
  },
  computed:{
    OnedimFigs: {
      get() {
        return Array.from(new Set(this.summarizeddata.figures.filter(fig=>fig.datatype == 2).filter(fig=>fig.rawdata.length>0).map(desc=>desc.figure_id)))
      }
    }
    
  },
  methods: {
  },
  updated: function(){
    //this.propnum = this.summarizeddata.figures.length
  },
  destroyed: function(){
  },
  created: function(){
  },
  mounted: function(){
  }
}
</script>
