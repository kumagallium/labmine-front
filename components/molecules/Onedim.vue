<template>
  <v-card flat style="height:100%;">
    <v-row style="width:100%;margin-top:10px;" class="ml-0 mr-0">
      <v-col md="12" v-if="!maximize">
        <v-text-field
          class=""
          :disabled="(notebook)||!(maximize)"
          label="Name"
          :value="figure.figure_name"
          outlined
          dense
          hide-details
        ></v-text-field>
      </v-col>
      <v-col md="6" class="">
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
            :disabled="(notebook)||(!maximize)"
            hide-details
            style="width:100%;"
            :items="definitions.map(item => item.name)"
            v-on:change="changeprop"
          ></v-select>
        </v-card>
      </v-col>
      <v-col md="6" class="">
        <v-card flat style="width:100%;">
          <v-select
            v-model="setUnitX"
            label="Unit(x)"
            v-bind:disabled="!dataedit"
            hide-details
            outlined
            dense
            style="width:100%;"
            :items="propx !== '' && definitions.map(item => item.name).indexOf(propx) >= 0 ? definitions.filter(def => def.name ===propx)[0].children.map(ch => ch.name) : []"
            v-on:change="bothChange"
          ></v-select>
        </v-card>
      </v-col>
    </v-row>
    <v-row style="width:100%;height:100px;" class="ml-0 mr-0">
      <v-col md="12" class="pt-0" style="height:100%">
        <v-card flat style="height:100%">
          <v-text-field style="" v-model="convertData" v-bind:disabled="!dataedit" v-on:change="changedData" v-bind:id="'dataarea'+idx+'_'+cluster" outlined label="Data" no-resize hide-details></v-text-field>
        </v-card>
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
import {mapGetters, mapActions } from 'vuex'

export default {
  data:function (){
    return{
      initflag:true,
      data:"",
      propx:"",
      propxid:"",
      unitx:"",
      saveentity:"",
      dataarray:[]
    }
  },
  props: ['dialog','idx','definitions','figure','dataedit','notebook','datalist','entityid','cluster','maximize'],
  watch: {
    entityid: function () {
      if(this.saveentity!=this.entityid){
        this.initflag = true
        this.unitx=""
        this.unity=""
        if(document.getElementById("dataarea"+String(this.idx)+'_'+String(this.cluster))){
          document.getElementById("dataarea"+String(this.idx)+'_'+String(this.cluster)).value = ""
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
        if(document.getElementById("dataarea"+String(this.idx)+'_'+String(this.cluster))) datatmp = document.getElementById("dataarea"+String(this.idx)+'_'+String(this.cluster)).value
        if(this.datalist && this.initflag){
          datatmp = ""
          const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
          this.dataarray = [];
          if(this.datalist['fields']['data']['rawdata'].length > 0){
            for(var x of transpose(this.datalist['fields']['data']['rawdata'])){
              datatmp += String(x) + "\n"
              this.dataarray.push({"x":x});
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
    }
  },
  methods: {
    changeprop:function(){

      this.propxid=""
      if(this.propx!=""){
        this.propxid = this.definitions.filter(def=>def.name==this.propx)[0].pk
      }

      if(this.dialog){
        if(Object.keys(this.figure.property_x).indexOf('created_at')<0){
          this.$emit('changeProperty',{"properties":{"property_x":{"property_name":this.propx,"id":this.propxid},"property_y":{"property_name":undefined,"id":undefined},"property_z":{"property_name":undefined,"id":undefined}}})
        }
      }
    },
    updatedData:function(){
      this.dataarray = [];
      for(var arrtmp of document.getElementById("dataarea"+String(this.idx)+'_'+String(this.cluster)).value.split("\n")){
        this.dataarray.push({"x":Number(arrtmp)});
      }
      this.changeprop()
    },
    changedData:function(){
      var unitxid = ""
      if(this.definitions.filter(def=>def.pk==this.propxid)[0].children.filter(ch => ch.name==this.unitx).length > 0)
        unitxid =this.definitions.filter(def=>def.pk==this.propxid)[0].children.filter(ch => ch.name==this.unitx)[0].pk
      const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
      var senddata = []
      for(var darr of this.dataarray){
        senddata.push(Object.values(darr))
      }
      if(senddata.length > 1) senddata = transpose(senddata)
      this.$emit('changedData',{"figureid":this.figure.id,"units":{"unit_x":{"unit_name":this.unitx,"id":unitxid},"unit_y":{"unit_name":"","id":""},"unit_z":{"unit_name":"","id":""}},"data":{"rawdata":senddata}})
    },
    bothChange: function () {
      this.changeprop();
      this.changedData();
    }
  },
  mounted: function(figidx){
    if(Object.keys(this.figure.property_x).indexOf('created_at')>-1){
      this.propx = this.figure.property_x.property_name
    }
    this.updatedData()
  },
  updated: function(){
    //this.updatedData()
  }
}
</script>
