<template>
  <v-hover v-slot:default="{ hover }">
    <v-card outlined elevation="1" :to="'/projects/'+id+'/dashboard/'" class="ml-2 mb-5">
        <v-card flat tile height="90" color="#203864">
          <v-card-text>
            <div class="white--text">Title:</div>
            <p class="title white--text">{{ title }}</p>
          </v-card-text>
        </v-card>
        <v-card-text>
          <div class="grey--text text--dark-1">Editor:</div>
          <p class="black--text">{{ editor }}</p>
          <div class="grey--text text--dark-1">Start-date:</div>
          <p class="black--text">{{ startdate }}</p>
          <v-btn id="pencil" small fab outlined :dark="false" @click.prevent="sendFlag" >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn id="delete" small fab outlined :dark="false" @click.prevent="deletefunc">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: ['id','title','editor','startdate'],
  methods: {
    sendFlag: function () {
      this.$emit('getFlag',{"editflag":1,"projectname":this.title,'projectid':this.id});
    },
    deletefunc: function () {
      this.$emit('deleteFlag',{'projectid':this.id});
    }
  }
}
</script>

<style>
</style>
