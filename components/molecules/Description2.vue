<template>
  <v-card flat style="height:100%;" class="sub pa-2">
    <v-row>
      <v-col class="pa-3">
          <v-data-table
            :headers="setHeaders"
            :items="setDescriptions"
            calculate-widths
            fixed-header
            hide-default-footer
            :height="setDescriptions.length > 8 ? '300':''"
            dense
          ></v-data-table>
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
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td{
  font-size:12px;
}
</style>
<script>

export default {
  data: function (){
    return{
      selecteditems:[],
      products:Array.from(new Set(this.descriptions.map(desc=>desc.product_name))),
      items: Array.from(new Set(this.descriptions.map(desc=>desc.item_name)))
    }
  },
  props: ['notebook','cluster','descriptions'],
  components: {
  },
  watch: {
  },
  methods: {
  },
  computed: {
    setHeaders:{
      get() {
        var headers = []
        if(this.cluster != 0){
          headers = [{
            text: "Sample name",
            value: "Sample name",
            align:"center",
            width:"150"
          }]
        }
        for(let item of this.items){
          headers.push({text:item,value:item,align:"center",width:"100"})
        }
        return headers
      },
    },
    setDescriptions:{
      get() {
        var descs = []
        var desc_tmp = {}
        for(let prod of this.products){
            desc_tmp = {}
          if(this.cluster != 0){
            desc_tmp = {"Sample name":prod}
          }
          for(let item of this.items){
            if(this.descriptions.filter(desc=>desc.product_name == prod).filter(desc=>desc.item_name == item).length > 0){
              for(let it of this.descriptions.filter(desc=>desc.product_name == prod).filter(desc=>desc.item_name == item)){
                if(Object.keys(desc_tmp).indexOf(item)>-1){
                  desc_tmp[item] = desc_tmp[item].concat(it.values)
                }
                else{
                  desc_tmp[item] = it.values
                }
              }
            }
          }
          descs.push(desc_tmp)
        }
        return descs
      }
    },
  },
  updated: function(){
    console.log("updated(product)")
  },
  destroyed: function(){
    console.log("destroyed")
  },
  created: function(){
    console.log("created(product)")
  },
  mounted: function(){
    console.log("mounted(product)")
  }
}
</script>
