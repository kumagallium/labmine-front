<template>
  <v-item v-slot:default="{ active, toggle }" :key="`item-${number}`" :value="symbol">
      <v-card outlined height="75" width="70"  @click="toggle" :style="active ? 'background-color:'+elcolor+'33;border-color:'+elcolor : 'border-color:'+elcolor" :class="active ? 'white--text ma-1' : 'ma-1'">
        <v-row no-gutters>
          <v-col md="6">
            <v-card flat color="rgb(0, 0, 0, 0.0)">
              <div class="text-left pl-1" v-bind:style="{fontSize:12+'px',height:10+'px',color: elcolor}">{{number}}</div>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <v-col md="8">
            <v-card flat color="rgb(0, 0, 0, 0.0)">
              <div class="text-center" v-bind:style="{fontSize:29+'px',height:45+'px',color: elcolor}">{{symbol}}</div>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <v-col md="12">
            <v-card  flat color="rgb(0, 0, 0, 0.0)">
            <div class="text-center" v-bind:style="{fontSize:10+'px', color: elcolor}">{{name}}</div>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-card>
  </v-item>
</template>

<style>
</style>

<script>
export default {
    props: ['number','symbol','name','elcolor']
}
</script>
