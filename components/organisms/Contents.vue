<template>
  <v-card flat style="height:100%;" class="sub" color="rgba(255, 255, 255, 0)">
    <!-- DescriptionCards -->
    <v-card outlined flat class="ma-2 figure" :ripple="false" style="cursor: default;">
      <v-row v-if="cluster!=0">
        <v-col md="12" class="" style="text-align:right;">
          <v-card outlined color="#f5f5f5" class="mt-2 mr-2 pl-2 pr-2 d-inline-block" style="width:fit-content;border-radius:50px;font-size: 0.9em;" v-if="boxid">
            BlockID: {{boxid}}
          </v-card>
        </v-col>
      </v-row>
      <v-row class="ml-0 mr-0">
        <v-col md="12" class="pb-0">
          <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pa-0">Description</v-card-title></v-card>       
        </v-col>
      </v-row> 
      <v-row style="width:100%;height:calc(100% - 70px);" class="ml-0 mr-0">
        <v-col md="12">
          <Description :cluster="cluster" :dataedit="dataedit" :defaults="defaults" :descriptions="descriptions" :items="items" v-on:changedDescriptions="changedDescriptions" v-on:addItems="addItems" v-on:removeItems="removeItems" :notebook="notebook"></Description> 
        </v-col>
      </v-row>
    </v-card>
    <!-- NoteCards -->
    <v-card v-if="notebook" outlined flat class="ma-2 py-2 figure" :ripple="false" style="cursor: default;">
      <v-row class="ml-0 mr-0">
        <v-col md="12" class="pb-0">
          <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pa-0">Note</v-card-title></v-card>       
        </v-col>
      </v-row> 
      <v-row style="width:100%;height:calc(100% - 70px);" class="ml-0 mr-0">
        <v-col md="12">
          <Notes :cluster="cluster" :dataedit="dataedit" :headlines='headlines' :sentences='sentences' v-on:changedSentences="changedSentences" v-on:addHeadlines="addHeadlines" v-on:removeHeadlines="removeHeadlines"></Notes>
        </v-col>
      </v-row>
    </v-card>
    <!-- DataCards -->
    <v-row class="pa-3" v-if="(cluster !=0)&&(details.figures.filter(fg => fg.cluster == this.cluster).length > 0)">
      <v-col cols="6" class="pa-0" v-for="(val, idx) in details.figures.filter(fg => fg.cluster == this.cluster)" :key="'image'+idx">
        <v-card v-if="cluster!=0" outlined flat  class="ma-2 figure" @click="selectedFig(idx)" :ripple="false" style="cursor: default;">
          <v-row class="mx-2">
            <v-col md="1" class="pb-0 pl-0" style="text-align:left;">
              <v-btn :disabled="notebook && !dataedit" icon @click.stop="onClickMaximize(val,idx);">
                <v-icon >mdi-pencil-box-multiple-outline</v-icon>
              </v-btn>
            </v-col>
            
            <v-col md="11" class="pb-0 pr-0 d-flex align-end flex-row-reverse" style="text-align:right;">
              <v-card outlined color="#f5f5f5" class="mb-2 mr-2 px-1 d-inline-block" style="width:fit-content;border-radius:50px;font-size: 0.7em;" v-if="val.id">
                FigureID: {{val.id}}
              </v-card>
            </v-col>
          </v-row>
          <v-row class="mx-2">
            <v-col md="12" class="py-0 pb-0 d-flex flex-row-reverse" style="text-align:left;">
              <v-card outlined color="#f5f5f5" class="px-1 d-inline-block" style="width:fit-content;border-radius:50px;font-size: 0.7em;" v-if="boxid">
                BlockID: {{boxid}}
              </v-card>
            </v-col>
          </v-row>
          <v-row style="width:100%;height:calc(100% - 70px);" class="ml-0 mr-0">
            <v-col md="12" class="px-0 pt-0">
              <ScatterPlot v-if="typelist[val['datatype']]=='ScatterPlot'" :key="componentKey" :dialog="''" :figurename="val['figure_name']" :maximize="false" :cluster="cluster" :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == val['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figure="val" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></ScatterPlot>
              <LineChart v-if="typelist[val['datatype']]=='LineChart'" :key="componentKey" :dialog="''" :figurename="val['figure_name']" :maximize="false" :cluster="cluster" :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == val['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figure="val" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></LineChart>
              <Onedim v-if="typelist[val['datatype']]=='One-dimension'" :key="componentKey" :cluster="cluster" :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == val['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="idx" :figure="val" :definitions="definitions" style="width:100%;" class="pb-3"></Onedim>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="6" class="pb-0" v-for="image in filterimages" :key="image.pk"  @click="selectedimage(image)">
        <Images :image="image" v-on:deleteimage="deleteimage"></Images>
      </v-col>
    </v-row>
    <v-row class="pa-3" v-else>
      <v-col cols="6" class="pb-0" v-for="image in filterimages" :key="image.pk"  @click="selectedimage(image)">
        <Images :image="image" v-on:deleteimage="deleteimage"></Images>
      </v-col>
    </v-row>
    <v-card v-if="!notebook" flat class="ma-2" color="rgb(0, 0, 0, 0.0)" height="50">
      <v-btn outlined color="rgba(0, 0, 0, 0.3)" @click="addProperty" style="width:100%;height:100%;">
        <v-icon>mdi-plus</v-icon> New
      </v-btn>
    </v-card>
    <v-card v-if="(notebook &&  boxid) || (cluster==0)" flat class="ma-2" color="rgb(0, 0, 0, 0.0)" height="50">
      <v-btn outlined color="rgba(0, 0, 0, 0.3)" @click.stop="addImage" style="width:100%;height:100%;">
        <v-icon>mdi-plus</v-icon> Add image
      </v-btn>
    </v-card>

    <!--　Data resistration diagram -->
    <v-dialog
      v-model="maximize"
      max-width="700"
    >
      <v-card>
        <!-- Errorbar -->
        <v-row v-if="error!=''">
          <v-col md="12" class="pa-0">     
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
          <v-col md="12" class="pb-0 pl-3 pr-3">
            <v-card-actions class="pb-0">
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                v-on:click="saveNewFigure"
              >
                <v-icon dark>mdi-content-save</v-icon>
                Save
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12" class="pl-3 pr-3">
            <v-row style="width:100%;" class="ml-0 mr-0">
              <!-- Figurename -->
              <v-col md="6" class="py-0">
                <v-text-field
                  class=""
                  :disabled="notebook"
                  label="Name"
                  :value="currentFig['figure_name']"
                  outlined
                  dense
                  hide-details
                  v-on:keyup="inputFigurename"
                ></v-text-field>
              </v-col>
              <!-- Datatype -->
              <v-col md="6" class="py-0">
                <v-select
                  v-if="currentFig['id']!=undefined"
                  class=""
                  :disabled="notebook"
                  v-model="selecttype[figureidx]"
                  :items="typelist"
                  label="Datatype"
                  outlined
                  dense
                  hide-details
                  v-on:change="changeType">""</v-select>
                <v-select
                  v-else
                  class=""
                  :disabled="notebook"
                  :value="typelist[0]"
                  :items="typelist"
                  label="Datatype"
                  outlined
                  dense
                  hide-details
                  v-on:change="changeType">""</v-select>
              </v-col>
            </v-row> 
            <v-row style="width:100%;height:calc(100% - 70px);" class="ml-0 mr-0">
              <v-col md="12" class="py-0">
                <ScatterPlot v-if="typelist[currentFig['datatype']]=='ScatterPlot'" :key="componentKey" :dialog="'dialog'" :figurename="currentFig['figure_name']" :maximize="maximize" :cluster="cluster" :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == currentFig['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="figureidx" :figure="currentFig" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></ScatterPlot>
                <LineChart v-if="typelist[currentFig['datatype']]=='LineChart'" :key="componentKey" :dialog="'dialog'" :figurename="currentFig['figure_name']" :maximize="maximize" :cluster="cluster" :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == currentFig['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="figureidx" :figure="currentFig" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></LineChart>
                <Onedim v-if="typelist[currentFig['datatype']]=='One-dimension'" :key="componentKey" :dialog="'dialog'" :maximize="maximize" :cluster="cluster" :entityid="entityid" v-on:changedData="changedData" v-on:changeProperty="changeProperty" :datalist="datalist.filter(dl => dl['fields']['figure'] == currentFig['id'])[0]" :notebook="notebook" :dataedit="dataedit" :idx="figureidx" :figure="currentFig" :definitions="definitions" style="width:100%;height:calc(100% - 70px);"></Onedim>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer />
          <v-col v-if="!notebook && currentFig['id']!=undefined" class="pr-3 pt-0" style="text-align:right;">
            <v-btn x-small text color="indigo lighten-4" @click="deleteProp(currentFig,figureidx)">
              Delete this Figure (FigureID:{{currentFig["id"]}})
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- Image resistration diagram -->
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
        <v-row v-if="notebook">
          <v-col md="12" class="pl-3 pr-3">
            <v-card flat height="100%" color="rgba(255, 255, 255, 0)">
              <v-row class="px-10" style="height: 100%;">
                <v-col md="12">
                  <v-form>
                    <v-row>
                      <v-col md="12">
                        <v-text-field v-model="image_name" hide-details label="image_name"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="6">
                        <v-text-field :value="cluster" hide-details label="cluster" readonly></v-text-field>
                      </v-col>
                      <v-col md="6">
                        <v-text-field :value="entityid" hide-details label="entityid" readonly></v-text-field>
                      </v-col>
                    </v-row>
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
                              ref="cropper"
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
                          <v-btn  :disabled="cropImg == '' || image_name ==''" width="100%" large color="primary" @click="sendForm" class="mt-1">Save</v-btn>
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
.figure:before{
  background:white;
}
.v-dialog{
  overflow: hidden;
}
</style>
<script>
import ScatterPlot from '~/components/molecules/ScatterPlot.vue'
import LineChart from '~/components/molecules/LineChart.vue'
import Description from '~/components/molecules/Description.vue'
import Notes from '~/components/molecules/Notes.vue'
import Onedim from '~/components/molecules/Onedim.vue'
import VueCropper from "vue-cropperjs";
import Compressor from 'compressorjs'
import "cropperjs/dist/cropper.css";
import Images from '~/components/molecules/Images.vue'

export default {
  data: function (){
    return{
      figureidx:0,
      selecttype:[],
      datatmp:[],
      currentFig:[],
      maximize:false,
      imagedialog:false,
      error:"",
      typelist:["ScatterPlot","LineChart","One-dimension"],
      file: null,
      filename: '',
      imgSrc: '',
      cropImg: '',
      cropfile: null,
      clearable: true,
      image_name: '',
      componentKey:0
    }
  },
  props: ['headlines','sentences','definitions','details','notebook','dataedit','datalist','boxid','entityid','targeterror','items','descriptions','defaults','cluster','images'],
  components: {
    ScatterPlot,
    LineChart,
    Description,
    Notes,
    Onedim,
    VueCropper,
    Images
  },
  watch: {
    details: function () {
      this.selecttype = []
      for(var df of this.details.figures.filter(fg => fg.cluster == this.cluster)){
        this.selecttype.push(this.typelist[df['datatype']])
      }
    }
  },
  computed:{
    filterimages () {
      var imagetmp = []
      if(this.images != undefined){
        if(this.images.length > 0){
          imagetmp = this.images.filter(img => img.fields.cluster == this.cluster)
        }
      }
      return imagetmp
    }
  },
  methods: {
    addProperty: function (e) {
      this.selecttype.push("ScatterPlot")
      this.figureidx = this.details.figures.filter(fg => fg.cluster == this.cluster).length
      var figtmp = {"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":undefined},"datatype":0,"cluster":this.cluster}
      this.onClickMaximize(figtmp,this.figureidx)
      //this.$emit('addProperty',this.details.figures.filter(fg => fg.cluster == this.cluster).length,this.cluster);
    },
    addImage: function (e) {
      this.imagedialog = true
    },
    inputFigurename: function(e){
      if(Object.keys(this.currentFig).indexOf('created_at')<0){
        this.currentFig["figure_name"] = e.target.value
        this.forceRerender()
      }
      else{
        this.$emit('changeFigurename',this.figureidx, e.target.value,this.cluster);
      }
    },
    changeProperty: function(properties){
      //this.$emit('changeProperty',this.figureidx, properties,this.cluster);
      this.currentFig["property_x"] = properties["properties"]["property_x"]
      this.currentFig["property_y"] = properties["properties"]["property_y"]
      this.currentFig["property_z"] = properties["properties"]["property_z"]
    },
    changedData: function(data){
      this.$emit('changedData', data);
      this.forceRerender()
    },
    changedSentences: function(headlineid,sentences,cluster){
      this.$emit('changedSentences', headlineid,sentences,cluster);
    },
    addHeadlines: function(add_defaults,cluster){
      this.$emit('addHeadlines', add_defaults,cluster);
    },
    removeHeadlines: function(remove_defaults,cluster){
      this.$emit('removeHeadlines',remove_defaults,cluster);
    },
    deleteProp: function(figure,idx){
      this.$emit('deleteProp',idx,figure,this.cluster);
      this.maximize=false;
      this.error = "";
    },
    deleteimage: function(image){
      this.$emit('deleteimage',image);
    },
    changeType: function(type){
      if(Object.keys(this.currentFig).indexOf('created_at')<0){
        this.currentFig["datatype"] = this.typelist.indexOf(type)
      }
      else{
        this.$emit('changeType',this.figureidx, this.typelist.indexOf(type),this.cluster);
      }
      
    },
    selectedFig: function(idx){
      this.figureidx = idx
    },
    selectedimage: function(image){
      console.log("selectedimage",image)
      console.log(image.fields.image)
    },
    addItems: function(val){
      this.$emit('addItems',val,this.cluster);
    },
    removeItems: function(val){
      this.$emit('removeItems',val,this.cluster);
    },
    changedDescriptions: function(itemid,descriptions){
      this.$emit('changedDescriptions',itemid,descriptions,this.cluster);
    },
    onClickMaximize: function(val,idx){
      this.error = "";
      this.currentFig = JSON.parse(JSON.stringify(val))
      this.maximize = true
      this.figureidx = idx
      this.$emit('getDatalist');
      this.forceRerender()
    },
    saveNewFigure: function(){
      if(this.currentFig.figure_name != ""){
        if(this.currentFig.property_x.property_name == "" || this.currentFig.property_y.property_name == "" || this.currentFig.property_z.property_name == "" ){
          this.error = "Please select properties."
        }
        else{
          this.figureidx = this.details.figures.filter(fg => fg.cluster == this.cluster).length
          if(Object.keys(this.currentFig).indexOf('created_at')<0){
            this.$emit('addProperty',this.figureidx,this.cluster,this.currentFig);
          }
          this.$emit('saveDetails');
          this.maximize=false;
          this.error = "";
        }
      }
      else{
        this.error = "Figure name is required."
        console.log("error",this.error)
      }
    },

    setImage(e) {
      console.log(e)
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
        }
      }
    },
    clearFileName: function(e) {
      e.target.value = '';
    },
    cropImage() {
      if(this.$refs.cropper.getCroppedCanvas() != null){
        this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
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
      this.$emit('sendForm',this.image_name,this.cluster,this.entityid,this.cropfile);
      this.imagedialog = false;
      this.file = null;
      this.filename = '';
      this.imgSrc = '';
      this.cropImg = '';
      this.cropfile = null;
      this.image_name = '';
    },
    forceRerender() {
      this.componentKey += 1;
    }
  },
  updated: function(){
    if(this.figureidx==undefined)this.figureidx=0
    if(this.figureidx>=this.details.figures.filter(fg => fg.cluster == this.cluster).length){
      this.figureidx = 0
    }
    //this.propnum = this.details.figures.length
  },
  destroyed: function(){
  },
  created: function(){
  },
  mounted: function(){
    this.selecttype = []
    for(var df of this.details.figures.filter(fg => fg.cluster == this.cluster)){
      this.selecttype.push(this.typelist[df['datatype']])
    }
  }
}
</script>
