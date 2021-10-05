<template>
  <v-card flat style="height:100%;" class="sub pa-2 pt-0">
    <v-row>
      <v-col class="pt-0">
        <v-combobox
          v-model="setItems"
          :items="this.items != undefined ? this.items.map(it => it.fields.item_name):[]"
          label="Items"
          multiple
          outlined
          dense
          small-chips
          hide-details
          :disabled="!(!dataedit ^ notebook)&&!(cluster==0)"
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row v-for="(item,idx) in setItems" :key="item">
          <v-col md="4" style="text-align:right;" class="pt-5">
            {{item}} :
          </v-col>
          <v-col md="8" class="pl-0">
            <v-combobox
              label="Description"
              v-model="setDescriptions[idx]"
              multiple
              outlined
              dense
              small-chips
              hide-details
              @change="changedDescriptions($event,item)"
              :disabled="(!dataedit)&&!(cluster==0)">
                <v-icon slot="append" disabled></v-icon>
            </v-combobox>
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
      selecteditems:[]
    }
  },
  props: ['items','descriptions','defaults','notebook','cluster','dataedit'],
  components: {
  },
  watch: {
  },
  methods: {
    changedDescriptions: function(descriptions,item){
      this.$emit('changedDescriptions',this.items.filter(it => it.fields.item_name == item)[0].pk,descriptions);
    },
  },
  computed: {
    setItems:{
      get() {
        var items = []
        if(this.descriptions != undefined){
          var defaults = this.defaults.filter(it => it.fields.cluster == this.cluster).map(it => it.fields.item_name)
          var description_tmp = this.descriptions.filter(it => it.fields.cluster == this.cluster).map(it => it.fields.item_name)
          var add_descriptions = defaults.filter(dt => description_tmp.indexOf(dt)<0)
          items = description_tmp.concat(add_descriptions)
        }
        return items
      },
      set(val) {
        var defaults_tmp = this.defaults.filter(it => it.fields.cluster == this.cluster).map(it => it.fields.item_name)
        var description_tmp = this.descriptions.filter(it => it.fields.cluster == this.cluster).map(it => it.fields.item_name)
        var add_descriptions = defaults_tmp.filter(dt => description_tmp.indexOf(dt)<0)
        var items = description_tmp.concat(add_descriptions)


        var add_defaults = val.filter(v => items.indexOf(v)<0)
        this.$emit('addItems',add_defaults);

        var remove_defaults_tmp = items.filter(dt => val.indexOf(dt)<0)
        var remove_defaults = this.items.filter(it => remove_defaults_tmp.indexOf(it.fields.item_name) >= 0).map(it => it.pk)
        if(description_tmp.length > 0){
          var hasvalues = this.descriptions.filter(it => it.fields.cluster == this.cluster).filter(des => des.fields.values.length > 0).map(des => des.fields.item)
          remove_defaults = remove_defaults.filter(rd => hasvalues.indexOf(rd) < 0)
        }
        if(remove_defaults.length > 0) this.$emit('removeItems',remove_defaults);
      }
    },
    setDescriptions:{
      get() {
        var descriptions = []
        if(this.descriptions != undefined){
          descriptions = this.descriptions.filter(it => it.fields.cluster == this.cluster).map(it => it.fields.values)
        }
        return descriptions
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
