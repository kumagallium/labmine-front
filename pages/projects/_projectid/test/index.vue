<template>
  <v-content wrap>
    <Navi :project="project"></Navi>
    <v-container style="height: 100%;" fluid>
      <v-card>
        <v-row class="px-10" style="height: 100%;">
          <v-col md="12">
            <v-form>
              <v-row>
                <v-col md="12">
                  <v-text-field v-model="image_name" label="image_name"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="6">
                  <v-text-field v-model="cluster" label="cluster"></v-text-field>
                </v-col>
                <v-col md="6">
                  <v-text-field v-model="entityid" label="entityid"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="12">
                  <v-file-input
                    label="カード画像"
                    accept="image/*"
                    :clearable="clearable"
                    @click="clearFileName"
                    @change="setImage"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="6">
                  <v-card style="height:calc(100vh - 365px);text-align:center;">
                      <vue-cropper
                         v-if="imgSrc != ''" 
                        ref="cropper"
                        :guides="true"
                        :view-mode="0"
                        drag-mode="crop"
                        :auto-crop-area="1"
                        :background="false"
                        :rotatable="false"
                        :src="imgSrc"
                        :aspect-ratio="1"
                        :img-style="{'height': 'calc(100vh - 365px)' }"
                        style="max-height:calc(100% - 44px);"
                      >
                      </vue-cropper>
                      <v-btn @click="cropImage" v-if="imgSrc != ''" class="mt-1"  style="position:absolute;bottom:0;left:0;width:100%;">Trim</v-btn>
                  </v-card>
                </v-col>
                <v-col md="6">
                  <v-card style="height:calc(100vh - 365px);text-align:center;">
                    <img
                      v-if="cropImg != ''"
                      :src="cropImg"
                      alt="Cropped Image"
                      style="max-height:calc(100% - 44px);"
                    >
                    <v-btn style="position:absolute;bottom:0;left:0;width:100%;" :disabled="cropImg == ''" width="100%" large color="primary" @click="sendForm" class="mt-1">Post</v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-content>

</template>


<style>
</style>

<script>
import Navi from '~/components/molecules/Navi.vue'
import VueCropper from "vue-cropperjs";
import Compressor from 'compressorjs'
import "cropperjs/dist/cropper.css";
import Cookies from 'universal-cookie'
import {mapGetters, mapActions } from 'vuex'

export default {
  layout: 'project',
  components: {
    Navi,
    VueCropper
  },
  async asyncData({ $axios,store,route,redirect }){
      $axios.setHeader('Authorization', "Bearer "+store.getters["access"])
      var project = await $axios.$get(`/v1/projects/${route.params.projectid}`)
                            .catch (error => {
                              console.log(error)
                            });
      if(!project)project = {"id":"","project_name":""}

      return {project: project}
  },
  created() {
    if(this.project.id == ""){
      const cookies = new Cookies()
      cookies.remove('user')
      cookies.remove('access')
      cookies.remove('refresh')
      this.$store.commit('setUser', {token:null,user:null})
      this.$router.push('/login')
    }
  },
  data() {
      return {
        file: null,
        filename: '',
        imgSrc: '',
        cropImg: '',
        cropfile: null,
        clearable: false,
        image_name: '',
        cluster:'',
        entityid:''
      }
  },
  computed: {
     loggedInUser () {
       return this.$store.state.user
     },
    ...mapGetters({emsg:'notebook/emsg'})

  },
  methods: {
    setImage(e) {
      console.log(e)
      //const file = e.target.files[0];
      //this.filename = file.name;
      if (!e.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        /*
        const reader = new FileReader();
        reader.onload = event => {
          this.imgSrc = event.target.result;
          if(this.$refs.cropper != undefined)this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(e);
        */
        //this.file = e;
        var self = this
        new Compressor(e, {
            quality: 0.6,
            maxHeight: 700,
            mimeType: 'image/jpeg',
            success(result) {
              console.log("result",result)
              self.file = result
              const reader = new FileReader();
              reader.onload = event => {
                self.imgSrc = event.target.result;
                if(self.$refs.cropper != undefined)self.$refs.cropper.replace(event.target.result);
              };
              reader.readAsDataURL(result);
            },
            error(err) {
              console.log(err.message);
            },
          });
        this.filename = e.name;
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    clearFileName: function(e) {
      e.target.value = '';
    },
    async sendForm(){
      var payload = {
          image_name:this.image_name,
          image:this.cropfile,
          cluster:this.cluster,
          entityid:this.entityid,
      }
      try{
        await this.publishImage({payload})
      } catch (e) {
        console.log(e)
      }
      //this.$refs.fileInput.lazyValue = '';
    },
    cropImage() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      var bin = atob(this.cropImg.replace(/^.*,/, ''));
      var buffer = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) {
          buffer[i] = bin.charCodeAt(i);
      }
      // Blobを作成
      var blob = new Blob([buffer.buffer],{type:this.file.type});
      this.cropfile =  new File([blob],this.file.name)
    },
    ...mapActions('notebook', ['publishImage'])

  },
  mounted: function(){
  }
}
</script>

<style>
</style>
