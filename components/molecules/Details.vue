<template>
  <v-card flat style="height:100%;" color="rgba(255, 255, 255, 0)">
    <v-row style="width:100%;height:100%;" class="ml-0 mr-0">
      <v-col md="12">
        <v-card flat outlined>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div style="width: calc(100% - 125px);">
              <v-card-title>
                <v-text-field :readonly="notebook" outlined dense label="Name" name="node_name" :value="details.node_name" v-on:keyup="commitDetails"></v-text-field>
              </v-card-title>

              <v-card-subtitle class="pb-0">
                <v-text-field label="Process Type" outlined dense readonly :value="details.type_name"></v-text-field>
              </v-card-subtitle>
            </div>
            <v-avatar
              v-if="details.node_name != undefined"
              class="ma-3"
              size="125"
              tile
              @click.stop="addImage"
              style="cursor: pointer;"
            >
              <v-img
                v-if="details.node_image=='images/node_default.png'"
                src="/img/node_default.png"
              ></v-img>
              <v-img v-else :src="absolutePath+'/api/media/'+details.node_image"></v-img>
            </v-avatar>
          </div>
        </v-card>
        <v-dialog
          v-model="imagedialog"
          max-width="900"
          color="rgba(255, 255, 255, 1)"
          style="overflow: hidden;"
        >
          <v-card flat height="100%" class="pa-5">
            <!-- Errorbar -->
            <v-row v-if="error!=''">
              <v-col md="12" class="">     
                <v-alert
                  dense
                  class="my-0"
                  type="error">
                  <v-row align="center" class="pa-0 ma-0">
                    <v-col class="grow pa-0">{{this.error}}</v-col>
                    <v-col class="shrink pa-0">
                      <v-btn id="close" color="white" text fab x-small @click="error=''" style="height:fit-content;">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
              </v-col>
            </v-row>
            <v-row v-if="!notebook">
              <v-col md="12" class="pl-3 pr-3">
                <v-card flat height="100%" color="rgba(255, 255, 255, 0)">
                  <v-row class="px-10" style="height: 100%;">
                    <v-col md="12">
                      <v-form>
                        <v-row>
                          <v-col md="12">
                            <v-file-input
                              label="カード画像"
                              accept="image/*"
                              :clearable="clearable"
                              @click:clear="clearimage"
                              @click="clearFileName"
                              @change="setImage"
                              v-model="file"
                              hide-details
                              prepend-icon="mdi-image"
                            ></v-file-input>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col md="6">
                            <v-card style="min-height: 250px;max-height:calc(100vh - 350px);text-align:center;">
                                <vue-cropper
                                  v-if="imgSrc != ''" 
                                  ref="node_cropper"
                                  :guides="true"
                                  :view-mode="0"
                                  drag-mode="move"
                                  :auto-crop-area="1"
                                  :background="false"
                                  :rotatable="false"
                                  :src="imgSrc"
                                  :aspect-ratio="1"
                                  :img-style="{'max-height': 'calc(100vh - 420px)' }"
                                  style="max-height:calc(100% - 44px);"
                                >
                                </vue-cropper>
                                <v-btn @click="cropImage" v-if="imgSrc != ''" class="mt-1"  style="width:100%;">Trim</v-btn>
                            </v-card>
                          </v-col>
                          <v-col md="6">
                            <v-card style="min-height: 250px;max-height:calc(100vh - 350px);text-align:center;">
                              <img
                                v-if="cropImg != ''"
                                :src="cropImg"
                                alt="Cropped Image"
                                style="max-width:100%;max-height:calc(100vh - 420px);"
                              >
                              <v-card v-if="cropImg == ''" height="250px"></v-card>
                              <v-btn  :disabled="cropImg == ''" width="100%" large color="primary" @click="sendForm" class="mt-1">Save</v-btn>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import VueCropper from "vue-cropperjs";
import Compressor from 'compressorjs'
import "cropperjs/dist/cropper.css";

export default {
  props: ['details','notebook'],
  components: {
    VueCropper
  },
  data () {
      return {
        select: null,
        items: [
          'Processing',
          'Measurement',
          'Other',
        ],
        imagedialog:false,
        file: null,
        filename: '',
        imgSrc: '',
        cropImg: '',
        cropfile: null,
        clearable: true,
        error:"",
      }
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
    commitDetails: function (e) {
      var inputs = {}
      inputs[e.target.name] =  e.target.value
      this.$emit('submitDetails',inputs);
    },
    addImage: function (e) {
      if(!this.notebook){
        this.imagedialog = true
      }
    },
    setImage(e) {
      //const file = e.target.files[0];
      //this.filename = file.name;
      if(e != null){
        if(e.name != this.filename){
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
                  self.file = result
                  const reader = new FileReader();
                  reader.onload = event => {
                    self.imgSrc = event.target.result;
                    if(self.$refs.node_cropper != undefined)self.$refs.node_cropper.replace(event.target.result);
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
        }
      }
    },
    clearFileName: function(e) {
      e.target.value = '';
    },
    cropImage() {
      if(this.$refs.node_cropper.getCroppedCanvas() != null){
        this.cropImg = this.$refs.node_cropper.getCroppedCanvas().toDataURL()
        var bin = atob(this.cropImg.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        var blob = new Blob([buffer.buffer],{type:this.file.type});
        this.cropfile =  new File([blob],this.file.name)
      }
    },
    clearimage(){
      this.file = null;
      this.filename = '';
      this.imgSrc = '';
      this.cropImg = '';
      this.cropfile = null;
    },
    sendForm(){
      this.$emit('sendForm',this.details.typeid,this.details.nodeid,this.details.node_name,this.cropfile);
      this.imagedialog = false;
      this.file = null;
      this.filename = '';
      this.imgSrc = '';
      this.cropImg = '';
      this.cropfile = null;
    },
  }
}
</script>

<style>
</style>
