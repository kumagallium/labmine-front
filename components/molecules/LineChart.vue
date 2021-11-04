<template>
  <v-card flat style="height:100%;">
    <!-- X-PropertyFields -->
    <v-row v-show="maximize" style="width:100%;margin-top:10px;" class="ml-0 mr-0">
      <v-col md="1" class="pb-0 pr-0 pl-0">
        <v-card flat style="width:100%;text-align:right;padding-top:7px;">X: </v-card>
      </v-col>
      <v-col md="6" class="pb-0">
        <v-card flat style="width:100%;">
          <v-select
            v-if="Object.keys(figure.property_x).indexOf('created_at')>-1"
            v-model="figure.property_x.property_name"
            label="Property(x)"
            outlined
            dense
            disabled
            hide-details
            style="width:100%;"
            :items="definitions.map(item => item.name)"
            v-on:change="changeprop"
          ></v-select>
          <v-select
            v-else
            v-model="setPropX"
            label="Property(x)"
            outlined
            dense
            hide-details
            :disabled="notebook"
            style="width:100%;"
            :items="definitions.map(item => item.name)"
            v-on:change="changeprop"
          ></v-select>
        </v-card>
      </v-col>
      <v-col md="5" class="pb-0">
        <v-card flat style="width:100%;">
          <v-select
            v-model="setUnitX"
            label="Unit(x)"
            v-bind:disabled="!dataedit"
            outlined
            dense
            hide-details
            style="width:100%;"
            :items="propx !== '' && definitions.map(item => item.name).indexOf(propx) >= 0 ? definitions.filter(def => def.name ===propx)[0].children.map(ch => ch.name) : []"
            v-on:change="bothChange"
          ></v-select>
        </v-card>
      </v-col>
    </v-row>
    <!-- Y-PropertyFields -->
    <v-row v-show="maximize" style="width:100%;" class="ml-0 mr-0">
      <v-col md="1" class="pb-0 pr-0 pl-0">
        <v-card flat style="width:100%;text-align:right;padding-top:7px;">Y: </v-card>
      </v-col>
      <v-col md="6" class="pb-0">
        <v-card flat style="width:100%;">
          <v-select
            v-if="Object.keys(figure.property_y).indexOf('created_at')>-1"
            v-model="figure.property_y.property_name"
            label="Property(y)"
            outlined
            dense
            disabled
            hide-details
            style="width:100%;"
            :items="definitions.map(item => item.name)"
            v-on:change="changeprop"
          ></v-select>
          <v-select
            v-else
            v-model="setPropY"
            label="Property(y)"
            outlined
            dense
            hide-details
            :disabled="notebook"
            style="width:100%;"
            :items="definitions.map(item => item.name)"
            v-on:change="changeprop"
          ></v-select>
        </v-card>
      </v-col>
      <v-col md="5" class="pb-0">
        <v-card flat style="width:100%;">
          <v-select
            v-model="setUnitY"
            label="Unit(y)"
            v-bind:disabled="!dataedit"
            outlined
            dense
            hide-details
            style="width:100%;"
            :items="propy !== '' && definitions.map(item => item.name).indexOf(propy) >= 0 ? definitions.filter(def => def.name ===propy)[0].children.map(ch => ch.name) : []"
            v-on:change="bothChange"
          ></v-select>
        </v-card>
      </v-col>
    </v-row>
    <v-row style="width:100%;height:calc(100% - 70px);" class="ml-0 mr-0">
      <!-- DataFields -->
      <v-col v-show="maximize" md="6" class="" style="height:100%">
        <v-card flat style="height:100%">
          <v-textarea
            style="height:100%;overflow-y:hidden;padding-top:5px;"
            v-model="convertData" v-bind:disabled="!dataedit"
            v-on:change="changedData"
            v-bind:id="'dataarea'+dialog+idx+'_'+cluster"
            outlined
            label="Data"
            no-resize
            hide-details></v-textarea>
        </v-card>
      </v-col>
      <!-- GraphFields -->
      <v-col :md="maximize ? 6 : 12" id="figparent" class="pb-5">
        <div :id="'figure'+dialog+idx+'_'+cluster" v-on:change="console.log('figurechange')" style="width:100%;">a</div>
      </v-col>
    </v-row>
  </v-card>
</template>
<style>
#figparent svg{
  width:100%;
  height:100%;
}
.v-input__control,.v-input__slot{
  height:100%;
}
textarea[id^="dataarea"] {
  height:100%;
}
</style>
<script>
import vgSpec_tmp from '~/static/vegaschema/linechart.json'
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
      saveentity:"",
      dataarray:[],
      vgSpec:JSON.parse(JSON.stringify(vgSpec_tmp))
    }
  },
  props: ['idx','definitions','saveflag','dialog','figure','dataedit','notebook','datalist','entityid','cluster','maximize','figurename'],
  watch: {
    entityid: function () {
      if(this.saveentity!=this.entityid){
        this.initflag = true
        this.unitx=""
        this.unity=""
        if(document.getElementById("dataarea"+String(this.dialog)+String(this.idx)+'_'+String(this.cluster))){
          document.getElementById("dataarea"+String(this.dialog)+String(this.idx)+'_'+String(this.cluster)).value = ""
          this.updatedData()
        }
        this.saveentity=this.entityid
      }
    },
    figure: function () {
      if(this.figure.figure_name==""){
        this.propx=""
        this.propy=""
      }
      else{
        this.propx=this.figure.property_x.property_name
        this.propy=this.figure.property_y.property_name
      }
    }
  },
  computed: {
    convertData: {
      get() {
        var datatmp = ""
        if(document.getElementById("dataarea"+String(this.dialog)+String(this.idx)+'_'+String(this.cluster))) datatmp = document.getElementById("dataarea"+String(this.dialog)+String(this.idx)+'_'+String(this.cluster)).value
        if(this.datalist && this.initflag){
          datatmp = ""
          const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
          this.dataarray = [];
          if(this.datalist['fields']['data']['rawdata'].length > 0){
            for(var xy of transpose(this.datalist['fields']['data']['rawdata'])){
              if(xy.length == 2){
                datatmp += String(xy[0]) + ", " + String(xy[1]) + "\n"
                this.dataarray.push({"x":xy[0],"y":xy[1]});
              }
            }
          }
          this.changeprop()
        }
        return datatmp
      },
      set(val) {
        this.initflag = false
        this.updatedData()
      }
    },
    setUnitX:{
      get() {
        var unitx = ""
        if(this.datalist){
          unitx =  this.datalist['fields']['unit_x_name']
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
        if(this.datalist){
          unity =  this.datalist['fields']['unit_y_name']
        }
        this.unity = unity
        return unity
      },
      set(val) {
        this.unity = val
      }
    },
    setPropX:{
      get() {
        var propx = ""
        propx =  this.figure.property_x["property_name"]
        this.propx = propx
        return propx
      },
      set(val) {
        this.propx = val
      }
    },
    setPropY:{
      get() {
        var propy = ""
        propy =  this.figure.property_y["property_name"]
        this.propy = propy
        return propy
      },
      set(val) {
        this.propy = val
      }
    }
  },
  methods: {
    changeprop:function(){
      //console.log("changeprop")
      this.vgSpec.title.text  = this.figurename;
      this.vgSpec.legends = []
      if(this.propx=="" && this.propx != undefined){
        this.vgSpec.axes[0].title  = "";
      }
      else{
        if(this.unitx=="" && this.unitx != undefined){
          this.vgSpec.axes[0].title = this.propx;
        }
        else{
          this.vgSpec.axes[0].title = this.propx + "[" + this.unitx + "]";
        }
      }

      if(this.propy=="" && this.propy != undefined){
        this.vgSpec.axes[1].title  = "";
      }
      else{
        if(this.unity=="" && this.unity != undefined){
          this.vgSpec.axes[1].title = this.propy;
        }
        else{
          this.vgSpec.axes[1].title = this.propy + "[" + this.unity + "]";
        }
      }
      if(this.dataarray.length==0){
        this.vgSpec.data[0].values = [{"x":0,"y":0},{"x":1,"y":1}];
      }
      else{
        this.vgSpec.data[0].values = this.dataarray;
      }

      this.propxid=""
      if(this.propx!="" && this.propx != undefined){
        this.propxid = this.definitions.filter(def=>def.name==this.propx)[0].pk
      }
      this.propyid=""
      if(this.propy!="" && this.propy != undefined){
        this.propyid = this.definitions.filter(def=>def.name==this.propy)[0].pk
      }

      if(this.dialog){
        if((Object.keys(this.figure.property_x).indexOf('created_at')<0) || (Object.keys(this.figure.property_y).indexOf('created_at')<0)){
          this.$emit('changeProperty',{"properties":{"property_x":{"property_name":this.propx,"id":this.propxid},"property_y":{"property_name":this.propy,"id":this.propyid},"property_z":{"property_name":undefined,"id":undefined}}})
        }
      }

      var view = new vega.View(vega.parse(this.vgSpec))
        .initialize("#figure"+this.dialog+String(this.idx)+'_'+String(this.cluster))
        .renderer('svg')
        .hover()
        .run();
    },
    updatedData:function(){
      this.dataarray = [];
      for(var arrtmp of document.getElementById("dataarea"+String(this.dialog)+String(this.idx)+'_'+String(this.cluster)).value.split("\n")){
        if(arrtmp.split(",").length == 2){
          this.dataarray.push({"x":Number(arrtmp.split(",")[0]),"y":Number(arrtmp.split(",")[1])});
        }
      }
      this.changeprop()
    },
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
      for(var darr of this.dataarray){
        senddata.push(Object.values(darr))
      }
      if(senddata.length > 1) senddata = transpose(senddata)
      if(senddata.length == 1) senddata = [[senddata[0][0]],[senddata[0][1]]]
      this.$emit('changedData',{"figureid":this.figure.id,"units":{"unit_x":{"unit_name":this.unitx,"id":unitxid},"unit_y":{"unit_name":this.unity,"id":unityid},"unit_z":{"unit_name":"","id":""}},"data":{"rawdata":senddata}})
    },
    bothChange: function () {
      this.changeprop();
      this.changedData();
    }
  },
  mounted: function(){
    //console.log("mounted(line)")
    if(Object.keys(this.figure.property_x).indexOf('created_at')>-1){
      this.propx = this.figure.property_x.property_name
    }
    if(Object.keys(this.figure.property_y).indexOf('created_at')>-1){
      this.propy = this.figure.property_y.property_name
    }
    this.updatedData()
  },
  updated: function(){
   //console.log("updated(line")
    //this.updatedData()
  }
}
</script>
