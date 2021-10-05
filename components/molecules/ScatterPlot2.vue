<template>
  <v-card flat style="height:100%;">
    <v-row style="width:100%;height:calc(100% - 70px);" class="mt-0 ml-0 mr-0">
      <!-- GraphFields -->
      <v-col :md="12" id="figparent" class="pt-0">
        <div :id="'figure'+idx+'_'+cluster" style="height:100%;width:100%;">a</div>
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
import vgSpec_tmp from '~/static/vegaschema/scatterplot.json'
var vega = require('vega');
import {mapGetters, mapActions } from 'vuex'

export default {
  data:function (){
    return{
      initflag:true,
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
  props: ['recipename','idx','definitions','saveflag','figure','dataedit','notebook','cluster','figurename'],
  watch: {
    figure: function () {
      if(this.figure.figure_name==""){
        this.propx=""
        this.propy=""
      }
      else{
        this.propx=this.figure.property[0].property_name
        this.propy=this.figure.property[1].property_name
      }
    }
  },
  computed: {
    convertData:{
      get() {
        const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
        var datatmp = [];
        try{
          if(this.figure['rawdata'].length > 0){
            //console.log("product_name",this.figure['rawdata'].map(rd=>rd.product_name))
            for(let productidx = 0;productidx<this.figure['rawdata'].length;productidx++){
              if(this.figure['rawdata'][productidx]["values"].length > 0){
                for(var xy of transpose(this.figure['rawdata'][productidx]["values"])){
                  if(xy.length == 2){
                    datatmp.push({"x":xy[0],"y":xy[1],"color":this.figure['rawdata'][productidx]["product_name"]});
                  }
                }
              }
            }
          }
        } catch (error) {
          console.log("convertdataerror",error)
          datatmp = [];
        }
        return datatmp
      }
    },
    setUnitX:{
      get() {
        var unitx = ""
        try {
          unitx =  this.figure['rawdata'][0]['units'][0]["unit_name"]
        } catch (error) {
          unitx = ""
        }
        this.unitx = unitx
        return unitx
      },
      set(val) {
        this.unitx = val
      }
      
    },
    setUnitY:{
      get() {
        var unity = ""
        try {
          unity =  this.figure['rawdata'][0]['units'][1]["unit_name"]
        } catch (error) {
          unity = ""
        }
        this.unity = unity
        return unity
      },
    },
    setPropX:{
      get() {
        var propx = ""
        propx =  this.figure.property[0]["property_name"]
        this.propx = propx
        return propx
      },
    },
    setPropY:{
      get() {
        var propy = ""
        propy =  this.figure.property[1]["property_name"]
        this.propy = propy
        return propy
      },
    }
  },
  methods: {
    changeprop:function(){
      console.log("changeprop")
      console.log("convertData",this.convertData)
      this.vgSpec.title.text  = this.figurename;
      if(this.setPropX==""){
        this.vgSpec.axes[0].title  = "";
      }
      else{
        if(this.setUnitX==""){
          this.vgSpec.axes[0].title = this.setPropX;
        }
        else{
          this.vgSpec.axes[0].title = this.setPropX + "[" + this.setUnitX + "]";
        }
      }

      if(this.setPropY==""){
        this.vgSpec.axes[1].title  = "";
      }
      else{
        if(this.setUnitY==""){
          this.vgSpec.axes[1].title = this.setPropY;
        }
        else{
          this.vgSpec.axes[1].title = this.setPropY + "[" + this.setUnitY + "]";
        }
      }
      if(this.convertData.length==0){
        this.vgSpec.data[0].values = [{"x":0,"y":0,"color":1},{"x":1,"y":1,"color":1}];
      }
      else{
        this.vgSpec.data[0].values = this.convertData;
      }

      this.propxid=""
      if(this.propx!=""){
        this.propxid = this.definitions.filter(def=>def.name==this.setPropX)[0].pk
      }
      this.propyid=""
      if(this.propy!=""){
        this.propyid = this.definitions.filter(def=>def.name==this.setPropY)[0].pk
      }

      var view = new vega.View(vega.parse(this.vgSpec))
        .initialize("#figure"+String(this.idx)+'_'+String(this.cluster))
        .renderer('svg')
        .hover()
        .run();
    },
    updatedData:function(){
      //console.log("updatedData")
      /*
      this.convertData = [];
      for(var arrtmp of document.getElementById("dataarea"+String(this.idx)+'_'+String(this.cluster)).value.split("\n")){
        if(arrtmp.split(",").length == 3){
          this.convertData.push({"x":Number(arrtmp.split(",")[0]),"y":Number(arrtmp.split(",")[1]),"color":Number(arrtmp.split(",")[2])});
        }
      }*/
      //this.changeprop()
    },
    /*
    changedData:function(){
      //console.log("changedData")
      var unitxid = ""
      if(this.definitions.filter(def=>def.pk==this.propxid)[0].children.filter(ch => ch.name==this.unitx).length > 0)
        unitxid =this.definitions.filter(def=>def.pk==this.propxid)[0].children.filter(ch => ch.name==this.unitx)[0].pk
      var unityid = ""
      if(this.definitions.filter(def=>def.pk==this.propyid)[0].children.filter(ch => ch.name==this.unity).length > 0)
        unityid = this.definitions.filter(def=>def.pk==this.propyid)[0].children.filter(ch => ch.name==this.unity)[0].pk
      const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
      var senddata = []
      for(var darr of this.convertData){
        senddata.push(Object.values(darr))
      }
      if(senddata.length > 1) senddata = transpose(senddata)
      if(senddata.length == 1) senddata = [[senddata[0][0]],[senddata[0][1]]]
      this.$emit('changedData',{"figureid":this.figure.figure_id,"units":{"unit_x":{"unit_name":this.unitx,"id":unitxid},"unit_y":{"unit_name":this.unity,"id":unityid},"unit_z":{"unit_name":"","id":""}},"data":[{"rawdata":senddata}]})
    },*/
    bothChange: function () {
      this.changeprop();
      //this.changedData();
    }
  },
  mounted: function(){
    if(Object.keys(this.figure.property[0]).indexOf('created_at')>-1){
      this.propx = this.figure.property[0].property_name
    }
    if(Object.keys(this.figure.property[1]).indexOf('created_at')>-1){
      this.propy = this.figure.property[1].property_name
    }
    //this.updatedData()
    this.changeprop()
  },
  created: function(){
  },
  updated: function(){
    //console.log("updated(scat")
    //this.updatedData()
  }
}
</script>
