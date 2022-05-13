<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-card flat color="rgba(255, 255, 255, 0)">
        <img style="max-width:100%;max-height:100%;width:100%;height:100%;" :src="absolutePath+':8001/api/media/'+image.fields.image">
        <v-fade-transition>
            <v-overlay
              v-if="hover"
              absolute
              color="black"
            >
                  <v-btn x-small style="position:absolute;top:5px;right:5px; background-color:#ff5252;" icon elevation="0" color="white" @click="deleteimage">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
            </v-overlay>
          </v-fade-transition>
      </v-card>
    </template>
  </v-hover>
</template>

<style>
.v-overlay__content{
  width:100%;
  height:100%;
}
</style>
<script>

export default {
  data:function (){
    return{
    }
  },
  props: ['image'],
  watch: {
  },
  computed: {
    absolutePath () {
      var url = window.location.origin
      if(window.location.origin.indexOf(':3000')){
        url = url.replace(":3000","")
      }
      
      return url
    },
  },
  methods: {
    deleteimage: function(){
      this.$emit('deleteimage',this.image);
    },
  },
  mounted: function(){
  },
  updated: function(){
  }
}
</script>
