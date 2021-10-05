<template>
  <v-card flat style="height:100%;">
    <v-row style="width:100%;height:calc(100% - 70px);" class="mt-0 ml-0 mr-0">
      <v-col :md="12" id="figparent" class="pt-0 px-0">
        <div :id="'ondim'+idx+'_'+cluster" style="height:100%;width:100%;">a</div>
      </v-col>
    </v-row>
  </v-card>
</template>
<style>
#figparent svg{
  width:100%;
  height:100%;
}
</style>
<script>
import vgSpec_tmp from '~/static/vegaschema/barchart.json'
var vega = require('vega');

export default {
  data:function (){
    return{
      data:"",
      propx:"",
      propxid:"",
      propy:"",
      propyid:"",
      unitx:"",
      unity:"",
      vgSpec:JSON.parse(JSON.stringify(vgSpec_tmp))
    }
  },
  props: ['figurename','cluster','idx','figures','definitions'],
  watch: {
  },
  computed: {
    convertData: {
      get() {
        // [{"x":"A","y":0,"color":1},{"x":"B","y":1,"color":1}]
        var products = Array.from(new Set(this.figures.map(fig => fig.rawdata)[0].map(raw=>raw.product_name)))
        var data = []
        for(let raw of this.figures.map(fig => fig.rawdata)[0]){
          data.push({"x":raw.product_name,"y":raw.values[0][0],"color":products.indexOf(raw.product_name)})
        }
        return data
      }
    },
  },
  methods: {
    changeprop:function(){
      this.vgSpec.title.text  = this.figurename;

      if(this.propy==""){
        this.vgSpec.axes[1].title  = "";
      }
      else{
        if(this.unity==""){
          this.vgSpec.axes[1].title = this.propy;
        }
        else{
          this.vgSpec.axes[1].title = this.propy + "[" + this.unity + "]";
        }
      }
      if(this.convertData.length==0){
        this.vgSpec.data[0].values = [{"x":"A","y":0,"color":1},{"x":"B","y":1,"color":1}];
      }
      else{
        this.vgSpec.data[0].values = this.convertData;
      }

      var view = new vega.View(vega.parse(this.vgSpec))
        .initialize("#ondim"+String(this.idx)+'_'+String(this.cluster))
        .renderer('svg')
        .hover()
        .run();
    },
  },
  mounted: function(){
    if(this.figures[0].property[0] != undefined) this.propy = this.figures[0].property[0].property_name
    if(this.figures[0].rawdata[0] != undefined) this.unity = this.figures[0].rawdata[0].units[0].unit_name
    this.changeprop()
  },
  updated: function(){
  }
}
</script>
