<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-card flat color="rgba(255, 255, 255, 0)">
        <img style="max-width:100%;max-height:100%;width:100%;height:100%;" :src="absolutePath+'/api/media/'+image.image">
        <v-fade-transition>
            <v-overlay
              v-if="hover"
              absolute
              color="black"
            >
              <v-row>
                <v-col class="pa-0">
                  <v-card class="ma-4 pa-4" style="background-color:#ffffffaa;color:black">
                    <v-row>
                      <v-col cols="12" class="pb-0 px-3">
                        Product: <br>
                        {{image.product_name}}
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="pt-0 px-3">
                        image_name: <br>
                        {{image.image_name}}
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            <v-spacer/>
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
  },
  mounted: function(){
  },
  updated: function(){
  }
}
</script>
