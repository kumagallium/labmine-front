<template>
  <v-main wrap>
    <Navi :project="project"></Navi>
    <v-container fluid style="height: 100%">
      <v-row style="height: 100%">
        <v-col md="6" class="" style="height: 100%">

          <!-- Left(Note) -->
          <v-card  flat class="pl-0 pr-0 position:relative;" style="height: 100%;" color="rgb(0, 0, 0, 0.0)">
            <v-row style="height: 100%;">
              <v-col md="12" class="" style="height: 100%">
                <v-card flat style="height=100%;">
                  <v-card outlined flat id="workspace" style="overflow:auto;height=100%;">
                    <draggable>
                      <div id="canvas" class="" style="width:3000px; height:3000px;"></div>
                    </draggable>
                  </v-card>

                  <v-card flat color="rgb(0, 0, 0, 0.0)" style="position:absolute;top:30px;right:30px;">
                    <v-btn dark id="open" small fab color="indigo" @click="overlayflowtable = !overlayflowtable;">
                      <v-icon dark>mdi-folder-outline</v-icon>
                    </v-btn>
                    <v-btn dark id="new" small fab color="indigo" v-on:click="newflow">
                      <v-icon dark>mdi-new-box</v-icon>
                    </v-btn>
                    <v-btn dark id="saveas" small fab color="indigo" @click="overlayflow = !overlayflow;editflag=0;flowname='';targeterror=''">
                      <v-icon dark>mdi-content-save-edit</v-icon>
                    </v-btn>
                    <v-btn v-if="this.flowid!=''" dark id="save" small fab color="indigo" v-on:click="updateflow">
                      <v-icon dark>mdi-content-save</v-icon>
                    </v-btn>
                    <v-btn v-else id="save" small fab color="indigo" disabled>
                      <v-icon dark>mdi-content-save</v-icon>
                    </v-btn>
                    <v-dialog
                      v-model="overlayflow"
                      max-width="290"
                    >
                      <v-card dark color="white">
                        <TargetEdit v-on:submitTarget="applyFlow" :target="'Workflow'" :editflag="editflag" :title="flowname" :editor="loggedInUser" :error="targeterror">
                        </TargetEdit>
                        <v-card-actions>
                          <v-btn
                            color="primary"
                            text
                            @click="overlayflow = false;error=''">Cancel
                          </v-btn>

                          <v-btn
                            color="primary"
                            text
                            @click="saveas"
                            v-bind:disabled="typename==''"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      v-model="overlayflowtable"
                      max-width="30%"
                    >
                      <v-card flat outlined color="rgba(255, 255, 255, 0.8)">
                        <v-card-title>
                          <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                          ></v-text-field>
                        </v-card-title>
                        <v-data-table :value="selectid=='' ? []:[templates[selectid]]" dense :search="search" :items-per-page=10 :headers="template_headers" :items="templates" item-key="flowname" class="elevation-0"  v-on:click:row="selecttemplate"></v-data-table>
                      </v-card>
                    </v-dialog>

                    <v-btn v-if="undoflag" dark id="undo" small fab color="indigo" v-on:click="undo()">
                      <v-icon dark>mdi-undo</v-icon>
                    </v-btn>
                    <v-btn v-else small fab color="indigo" disabled>
                      <v-icon dark>mdi-undo</v-icon>
                    </v-btn>

                    <v-btn v-if="redoflag" dark small fab color="indigo" v-on:click="redo()">
                      <v-icon dark>mdi-redo</v-icon>
                    </v-btn>
                    <v-btn v-else dak id="redo" small fab color="indigo" disabled>
                      <v-icon dark>mdi-redo</v-icon>
                    </v-btn>

                    <!--<v-btn small fab dark color="indigo" v-on:click="addfunc()">
                      <v-icon dark>mdi-shape-rectangle-plus</v-icon>
                    </v-btn>-->

                    <v-btn v-if="deleteflag" dark small fab color="indigo" v-on:click="deletefunc()">
                      <v-icon dark>mdi-trash-can</v-icon>
                    </v-btn>
                    <v-btn v-else small fab color="indigo" disabled>
                      <v-icon dark>mdi-trash-can</v-icon>
                    </v-btn>

                    <v-btn small fab dark color="indigo" v-on:click="zoomfunc(1)">
                      <v-icon dark>mdi-magnify-plus</v-icon>
                    </v-btn>
                    <v-btn small fab dark color="indigo" v-on:click="zoomfunc(-1)">
                      <v-icon dark>mdi-magnify-minus</v-icon>
                    </v-btn>
                    <v-btn small fab dark color="indigo" v-on:click="zoomfunc(0)">
                      <v-icon dark>mdi-code-brackets</v-icon>
                    </v-btn>
                  </v-card>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col md="6" class="pl-1" style="height: 100%">
          <!-- Right(Contents) -->
          <v-sheet style="height: 100vh; margin-top:-12px;margin-bottom:-24px;" class="details pt-2 pl-0 pr-2 overflow-y-auto" color="rgb(0, 0, 0, 0.0)">
            <v-row style="height: 100%">
              <v-col md="12" class="" style="height: 100%;">
                <v-card flat class="pl-2 pr-2 mb-3" style="margin-top:12px; margin-left:5px;eight: 100%;" color="rgb(0, 0, 0, 0.0)">
                  <!-- Errorbar -->
                  <v-row v-if="error!=''">
                    <v-col md="11" class="pl-3 pt-0 pr-0 pb-0">     
                      <v-alert
                        dense
                        type="error">
                        <v-row align="center" class="pa-0 ma-0">
                          <v-col class="grow pa-0">{{this.error[0]}}</v-col>
                          <v-col class="shrink pa-0">
                            <v-btn id="close" color="white" text fab x-small @click="error=''" style="height:fit-content;">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-alert>
                    </v-col>
                  </v-row>
                  <!-- BlockField -->
                  <v-row>
                    <v-col>
                      <v-btn-toggle v-model="concept_switch" mandatory @change="changeConcept">
                          <v-btn
                              outlined
                              rounded
                              small
                          >Material</v-btn>
                          <v-btn
                              outlined
                              rounded
                              small
                          >Tool</v-btn>
                          <v-btn
                              outlined
                              rounded
                              small
                          >Action</v-btn>
                      </v-btn-toggle>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col md="11" class="pl-3 pt-0 pr-0">  
                      <v-card flat outlined style="overflow:auto;width:100%; height:100%;" class="mb-3" >
                        <v-tabs  v-if="(types.length > 0) && (nodes.length == types.length)" dark background-color="indigo darken-3" left show-arrows v-model="active_tab">
                          <v-tabs-slider color="indigo lighten-3" v-model="active_tab"></v-tabs-slider>
                          <v-tab v-for="(type,typeidx) of types" :key="typeidx" @click="changeTab(typeidx)">{{type.contents.fields.type_name}}</v-tab>
                        </v-tabs>

                        <v-tabs-items v-if="(types.length > 0) && (nodes.length == types.length)" v-model="active_tab">
                          <v-tab-item v-for="(type,typeidx) of types" :key="typeidx">
                            <v-card flat class="ma-3">
                              <draggable :sort="false">
                                <transition-group  type="transition">
                                  <v-card
                                    :ripple="false"
                                    flat
                                    :rounded="concept_switch == 2 ? '':'pill'"
                                    outlined
                                    v-for="(proc, index)  of nodes[typeidx].contents.node_name"
                                    :key="proc"
                                    v-on:dragstart="startDrag"
                                    v-on:drag="doDrag"
                                    v-on:dragend="stopDrag"
                                    v-on:click="changeDetails(nodes[typeidx].contents.typeid,nodes[typeidx].contents.pk[index])"
                                    :style="'background-color:'+nodes[typeidx].contents.color+';'"
                                    class="text-center ma-1 float-left node"
                                  >
                                    {{proc}}
                                  </v-card>
                                </transition-group>
                              </draggable>
                              <v-btn id="plus" outlined :style="'height: 25px;width:100px;min-width:100px;border-color: #555;background-color:#eee;'" class="text-center ma-1 float-left"  v-on:click="addDetails" >
                                <v-icon dark>mdi-plus</v-icon>
                              </v-btn>
                            </v-card>
                          </v-tab-item>
                        </v-tabs-items>
                        <v-card v-if="types.length <= 0" flat class="pt-3" style="height:100%;text-align:center;">
                          Click + icon to make categories
                        </v-card>
                        
                      </v-card>
                    </v-col>
                    <v-col md="1" class="pl-2 pr-1 pt-1">
                      <v-btn id="plus" small fab dark color="indigo darken-3" @click="overlay = !overlay;editflag=0;typename='';typeid='';targeterror=''">
                        <v-icon dark>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn  v-if="types.length > 0" id="pencil" small fab dark color="indigo darken-3" @click="overlay = !overlay;editflag=1;">
                        <v-icon dark>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn  v-if="types.length > 0" id="delete" small fab dark color="indigo darken-3" @click="deleteNode">
                        <v-icon dark>mdi-delete</v-icon>
                      </v-btn>

                      <v-dialog
                        v-model="overlay"
                        max-width="290"
                      >
                        <v-card dark color="white">
                          <TargetEdit v-on:submitTarget="applyTarget" :target="'Category'" :editflag="editflag" :title="typename" :editor="loggedInUser" :error="targeterror">
                          </TargetEdit>
                          <v-card-actions>
                            <v-btn
                              color="primary"
                              text
                              @click="overlay = false;error=''">Cancel
                            </v-btn>

                            <v-btn
                              color="primary"
                              text
                              @click="publishNode"
                              v-bind:disabled="typename==''"
                            >
                              Save
                            </v-btn>
                          </v-card-actions>

                        </v-card>
                      </v-dialog>
                    </v-col>
                  </v-row>

                  <!-- ContentField -->
                  <v-row>
                    <v-col md="11" class="pl-3 pr-0">
                      <v-card v-if="nodes.length > 0" flat outlined style="overflow:hidden;width:100%;" class="mb-3" color="blue-grey lighten-5">
                        <v-expansion-panels
                          v-model="panel"
                          multiple
                          accordion
                          flat
                          class="mb-3"
                        >
                          <v-expansion-panel style="background-color:rgba(255, 255, 255, 0);">
                            <v-expansion-panel-header>
                              <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pb-0 text-h5 font-weight-bold">Information</v-card-title></v-card>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <Details :notebook="false" :details="details" v-on:submitDetails="applyDetails" v-on:sendForm="sendForm"></Details>
                            </v-expansion-panel-content>
                          </v-expansion-panel>

                          <v-expansion-panel v-if="details.nodeid" style="background-color:rgba(255, 255, 255, 0);border-top:2px solid #FFF;">
                            <v-expansion-panel-header>
                              <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pb-0 text-h5 font-weight-bold">Methods</v-card-title></v-card>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <Contents :targeterror="targeterror" :entityid="''" :boxid="select_boxid[0]" :datalist="[]" :cluster="1" :defaults="defaults" :descriptions="[]" :items="items" :dataedit="false"  :notebook="false" :definitions="definitions"  v-on:addItems="addItems" :details="details" v-on:removeItems="removeItems" v-on:saveDetails="saveDetails" v-on:deleteProp="deleteProp" v-on:addProperty="addProperty" v-on:changeType="changeType" v-on:changeFigurename="setFigurename" v-on:changeProperty="changeProperty"></Contents>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                          
                          <v-expansion-panel v-if="(details.nodeid)&&(concept_switch==2)" style="background-color:rgba(255, 255, 255, 0);border-top:2px solid #FFF;">
                            <v-expansion-panel-header>
                              <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pb-0 text-h5 font-weight-bold">Results</v-card-title></v-card>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <Contents :targeterror="targeterror" :entityid="''" :boxid="select_boxid[0]" :datalist="[]" :cluster="2" :defaults="defaults" :descriptions="[]" :items="items" :dataedit="false"  :notebook="false" :definitions="definitions"  v-on:addItems="addItems" :details="details" v-on:removeItems="removeItems" v-on:saveDetails="saveDetails" v-on:deleteProp="deleteProp" v-on:addProperty="addProperty" v-on:changeType="changeType" v-on:changeFigurename="setFigurename" v-on:changeProperty="changeProperty"></Contents>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-card>
                    </v-col>
                    <v-col v-if="(nodes.length > 0) && (nodes.length == types.length) && (nodes.length > active_tab)" md="1" class="pl-2 pr-1 pt-1">
                      <v-btn id="plus" small fab light :color="nodes[active_tab].contents.color" v-on:click="saveDetails">
                        <v-icon dark>mdi-content-save</v-icon>
                      </v-btn>
                      <v-btn id="delete" v-if="details.nodeid" small fab light  :color="nodes[active_tab].contents.color" @click="deleteDetails">
                        <v-icon dark>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <!--
                  <v-card flat outlined style="overflow:auto;width:100%; height:5%;" class="mb-3">
                      <textarea id="json" v-model="jsonDocument" v-on:change="changeJSON" style="overflow:auto;width:100%; height:100%;background:#f5f5f5;border:1px solid #eee;">
                      </textarea>
                  </v-card>
                  <v-card flat outlined style="overflow:auto;width:100%; height:100%;" class="mb-3">
                    <textarea id="details"  style="overflow:auto;width:100%; height:100%; background:#f5f5f5;border:1px solid #eee;">
                      {{ JSON.stringify(details,null,2) }}
                    </textarea>
                  </v-card>
                  -->
                </v-card>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style>
.node{
  height: 25px;
  width:100px;
  border-color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.theme--light.v-data-table{
  background-color:rgba(255, 255, 255, 0)
}

</style>

<script>
import Navi from '~/components/molecules/Navi.vue'
import draggable from 'vuedraggable'
import Details from '~/components/molecules/Details.vue'
import Contents from '~/components/organisms/Contents.vue'
import Cookies from 'universal-cookie'
import TargetEdit from '~/components/molecules/TargetEdit.vue'
import {mapGetters, mapActions } from 'vuex'

var canvas = null;
var reader = null;

export default {
  layout: 'project',
  components: { Navi,draggable,Details,TargetEdit,Contents },
  async asyncData({ $axios,store,route,redirect }){
      $axios.setHeader('Authorization', "Bearer "+store.state["access"])
      var project = await $axios.$get(`/v1/projects/${route.params.projectid}`)
                            .catch (error => {
                              const cookies = new Cookies()
                              cookies.remove('user', { path: '/' })
                              cookies.remove('access', { path: '/' })
                              cookies.remove('refresh', { path: '/' })
                              store.commit('setUser', {token:null,user:null})
                              redirect('/login')
                            });
      if(!project)project = {"id":"","project_name":""}
      else{
        var payload = {"concept":0}
        await store.dispatch('design/fetchTypes',{payload})
        await store.dispatch('design/fetchNodes',{payload})
        await store.dispatch('notebook/fetchItems')
        await store.dispatch('design/fetchBlueprints')
        await store.dispatch('definition/fetchDefinitions')
      }
      return {project: project}
  },
  data:function () {
      return {
          zoom:1,
          panel:[],
          concept_switch:0,
          workspaceX:0,
          workspaceY:0,
          jsonDocument:[],
          deleteflag:false,
          undoflag:false,
          redoflag:false,
          clearflag:false,
          proclist:["Crushing","Cutting","Polishing","Annealing","Arc-melting","Sintering"],
          measurelist:["ZEM","XRD","Hall-effect","Leaser-flash"],
          otherlist:["Weighing"],
          canvasx:0,
          canvasy:0,
          offsetx:0,
          offsety:0,
          selectid:"",
          dragname:"",
          dragcolor:"#eee",
          overlay: false,
          overlayflow:false,
          overlayflowtable:false,
          absolute: false,
          opacity:0.4,
          zIndex: 5,
          typename:"",
          flowname:"",
          flowid:"",
          editflag:0,
          active_tab:0,
          switch_prop:0,
          search:"",
          select_nodeid:[],
          select_boxid:[],
          error:"",
          targeterror:"",
          template_headers:[
            {text:"Flow name",value:"flowname"},
            {text:"Editor",value:"editor"}
          ]
      }
  },
  created() {
    if(this.project.id == ""){
      const cookies = new Cookies()
      cookies.remove('user', { path: '/' })
      cookies.remove('access', { path: '/' })
      cookies.remove('refresh', { path: '/' })
      this.$store.commit('setUser', {token:null,user:null})
      this.$router.push('/login')
    }
  },
  computed: {
     loggedInUser () {
       return this.$store.state.user
     },
     ...mapGetters({defaults:'notebook/defaults',items:'notebook/items', types:'design/types',nodes:'design/nodes',template:'design/template',templates:'design/templates',details:'design/details',emsg:'design/emsg',definitions:'definition/definitions'})
  },
  methods: {
    async selecttemplate(val){
      this.flowname = val.flowname
      this.flowid = val.pk
      this.selectid = val.id
      const payload = {
        templateid: Number(val.pk)
      }
      try{
        await this.getBlueprint({payload})
        this.jsonDocument = JSON.stringify(this.template,null,2)
        this.changeJSON()
        try{
          this.fitZoom();
        }catch(e){
          canvas.setZoom(1,true);
        }
      } catch (e) {
        this.error = this.emsg
      }
    },
    newflow:function(){
      this.flowid = ""
      this.selectid = ""
      this.select_nodeid = [];
      this.select_boxid = [];
      try{
        this.$store.commit('design/clearTemplate')
        this.jsonDocument = JSON.stringify(this.template,null,2)
        this.changeJSON()
        try{
          this.fitZoom();
        }catch(e){
          canvas.setZoom(1,true);
        }
      } catch (e) {
        this.error = this.emsg
      }
    },
    async saveas(){
      if(typeof this.jsonDocument === "object") this.jsonDocument=JSON.stringify(this.jsonDocument,null,2)
      const payload = {
        template: JSON.parse(this.jsonDocument),
        flowname: this.flowname
      }
      try{
        await this.publishTemplate({payload})
        await this.$store.dispatch('design/fetchBlueprints')
        this.overlayflow = false
        this.targeterror = ""
        this.flowid = this.templates.filter(tmp => tmp.flowname == this.flowname)[0].pk
      } catch (e) {
        this.targeterror = this.emsg
        if(Object.keys(this.targeterror).indexOf('blueprint_name') != -1){
          this.targeterror["name"] = this.targeterror["blueprint_name"]
        }
      }
    },
    async updateflow(){
      const payload = {
        flowid:this.flowid,
        template: JSON.parse(this.jsonDocument),
        flowname: this.flowname
      }
      await this.editBlueprint({payload})
    },
    zoomfunc:function(val){
      if (process.client) {
        var beforezoom = canvas.getZoom();
        if(val==1){
          canvas.setZoom(beforezoom * 0.9,true);
        }
        else if(val==-1){
          canvas.setZoom(beforezoom * 1.1,true);
        }
        else{
          try{
            this.fitZoom();
          }catch(e){
            canvas.setZoom(1,true);
          }
        }
      }
    },
    displayJSON:function(){
      var self = this
      var writer = new draw2d.io.json.Writer();
      writer.marshal(canvas, function(json){
        if(json.length > 0 && !self.clearflag){
          self.jsonDocument=JSON.stringify(json,null,2)
        }
      });
    },
    changeJSON:function(){
      canvas.setZoom(1,true);
      this.clearflag = true
      canvas.clear();
      this.clearflag = false
      this.deleteflag=false;
      reader.unmarshal(canvas, this.jsonDocument);
      try{
        this.fitZoom();
      }catch(e){
        canvas.setZoom(1,true);
      }
    },
    handleResize:function(){
      var wH = $(window).height();
      $('#workspace').css('height',wH-30+'px');
      this.workspaceY = wH-30
    },
    fitZoom:function(){
      var maxX = 0;
      var maxY = 0;
      for(var fig of canvas.getFigures().data){
        if(fig.x>=maxX){
          maxX = fig.x
        }
        if(fig.y>=maxY){
          maxY = fig.y
        }
      }
      var figureSpaceX = 150 + maxX;
      var figureSpaceY = 100 + maxY;
      this.workspaceX = canvas.getHtmlContainer()[0].parentElement.clientWidth;

      if((this.workspaceX - figureSpaceX) < 0 || (this.workspaceY - figureSpaceY) < 0){
        if((this.workspaceX - figureSpaceX)>(this.workspaceY - figureSpaceY)){
          canvas.setZoom(figureSpaceY/this.workspaceY,true);
        }
        else{
          canvas.setZoom(figureSpaceX/this.workspaceX,true);
        }
      }
      if((this.workspaceX - figureSpaceX) >= 0 && (this.workspaceY - figureSpaceY) >= 0){
        canvas.setZoom(1,true);
      }
    },
    async deletefunc(){
      if(this.flowid!="" && this.select_nodeid!=[] && this.select_boxid!=[]){
        const payload = {
          flowid: Number(this.flowid),
          nodeid:this.select_nodeid,
          boxid:this.select_boxid
        }
        try{
          await this.removeEntity({payload})
        } catch (e) {
          this.error = this.emsg
        }
      }
      for(var fig of canvas.getSelection().getAll().data){
        var cmd = new draw2d.command.CommandDelete(fig);
        canvas.getCommandStack().execute(cmd);
      }
    },
    undo:function(){
      canvas.getCommandStack().undo();
    },
    redo:function(){
      canvas.getCommandStack().redo();
    },
    stackChanged:function(event){
      this.undoflag = event.getStack().canUndo();
      this.redoflag = event.getStack().canRedo();
  	},
    startDrag:function() {
      this.offsetx = event.offsetX;
      this.offsety = event.offsetY;
    },
    stopDrag:function(event) {
      if("svg" == document.elementFromPoint(event.clientX, event.clientY).tagName){
        var currentZoom = canvas.getZoom();
        var nodeid = this.nodes[this.active_tab].contents.pk[this.nodes[this.active_tab].contents.node_name.indexOf(this.dragname)]
        if(this.dragname.length > 10) this.dragname = this.dragname.substr(0,10)+"...";
        var label = new draw2d.shape.basic.Label({text:this.dragname,stroke:0, fontColor:"#0d0d0d"});
        if(this.concept_switch==0) var fig = new MaterialFigure({bgColor:this.dragcolor});//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
        else if(this.concept_switch==1) var fig = new ToolFigure({bgColor:this.dragcolor});//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
        else var fig = new CustomFigure({bgColor:this.dragcolor});//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
        fig.add(label, new draw2d.layout.locator.CenterLocator());
        fig.attr('userData', {"nodeid":nodeid,"typeid":this.typeid,"concept_switch":this.concept_switch,"active_tab":this.active_tab}); 
        canvas.add(fig,this.canvasx*currentZoom,this.canvasy*currentZoom);
        this.displayJSON();
      }

    },
    doDrag:function(event) {
      if("svg" == document.elementFromPoint(event.clientX, event.clientY).tagName){
        var currentZoom = canvas.getZoom();
        this.dragname = event.srcElement.innerHTML.trim();
        this.dragcolor = event.srcElement.style.backgroundColor;
        this.canvasx = event.clientX - this.offsetx - canvas.getAbsoluteX();
        this.canvasy = event.clientY - this.offsety - canvas.getAbsoluteY();
      }
    },
    applyTarget:function(typename_tmp){
      this.typename = typename_tmp
    },
    applyFlow:function(flowname_tmp){
      this.flowname = flowname_tmp
    },
    applyDetails:function(input){
      this.$store.commit('design/updateDetail',{input:input})
    },
    changeTab:function(typeidx){
      this.active_tab = typeidx
      if(this.active_tab >= this.types.length)this.active_tab = 0
      if(this.active_tab==undefined)this.active_tab = 0
      this.typename = this.types[this.active_tab].contents.fields.type_name
      this.typeid = this.types[this.active_tab].contents.pk
      this.newDetails()
      this.error=""
    },
    newDetails:function(){
      this.$store.commit('design/clearDetails')
      this.$store.commit('design/updateDetail',{input:{"typeid":this.types[this.active_tab].contents.pk}})
      this.$store.commit('design/updateDetail',{input:{"type_name":this.types[this.active_tab].contents.fields.type_name}})
      this.$store.commit('design/updateDetail',{input:{"figures":[{"figure_name": "","property_x": {"property_name":undefined},"property_y":  {"property_name":undefined},"property_z":  {"property_name":undefined},"datatype":0,"cluster":0},
                                                        {"figure_name": "","property_x": {"property_name":undefined},"property_y":  {"property_name":undefined},"property_z":  {"property_name":undefined},"datatype":0,"cluster":1}]}})
    },
    addDetails:function(){
      if(this.panel.indexOf(0)<0)this.panel.push(0)
      this.newDetails()
    },
    addProperty:function(propnum,cluster,newfigure){
      /*if(propnum==0){
        this.$store.commit('design/updateDetail',{input:{"figures":[{"figure_name": "","property_x": {"property_name":undefined},"property_y":  {"property_name":undefined},"property_z":  {"property_name":undefined},"datatype":0,"cluster":cluster}]}})
      }
      else{*/
        this.$store.commit('design/pushFigure',{input:newfigure})
      //}
    },
    async deleteProp(idx,figure,cluster){
      if(figure["created_at"] != undefined){
        var payload = {
          figureid: figure.id,
          typeid: this.details.typeid,
          nodeid:this.details.nodeid
        }
        try{
          await this.removeFigure({payload})
          await this.$store.dispatch('design/fetchDetails',{payload})
        } catch (e) {
          this.error = this.emsg
        }
      }
    },
    async saveDetails(){
      if(Object.keys(this.details).indexOf('node_name') >= 0){
        if(this.details.nodeid){
          await this.editDetails({payload:this.details})
          if(this.details.figures.map(fig => Object.keys(fig).indexOf("created_at")>=0).indexOf(false) >=0){
            for(var fig of this.details.figures.filter(fig => Object.keys(fig).indexOf("created_at")<0)){
              if(fig.figure_name != ""){
                if(fig.property_x.property_name == "" || fig.property_y.property_name == "" || fig.property_z.property_name == "" ){
                  this.targeterror = ["Please select properties."]
                }
                else{
                  try{
                    await this.publishProperty({nodeid:this.details.nodeid, payload:fig})
                    this.targeterror = ""
                    this.error = ""
                  } catch (e) {
                    this.targeterror = this.emsg
                    console.log("this.targeterror")
                    console.log(this.targeterror)
                  }
                }
              }
            }
            if(this.targeterror=="" && this.error==""){
              var payload = {
                typeid: this.details.typeid,
                nodeid:this.details.nodeid,
                notebook:false
              }
              await this.$store.dispatch('design/fetchDetails',{payload})
             }
          }
          
          if(this.flowid != ""){
            var payload = {
              templateid: Number(this.flowid)
            }
            try{
              await this.getBlueprint({payload})
              this.jsonDocument = JSON.stringify(this.template,null,2)
              this.changeJSON()
            } catch (e) {
              this.error = this.emsg
            }
          }
        }
        else{
          await this.publishDetail({payload:this.details})
          var payload = {
            typeid: this.details.typeid,
            nodeid:this.details.nodeid,
            notebook:false
          }
          await this.$store.dispatch('notebook/fetchItems')
          await this.$store.dispatch('notebook/fetchDefaults',{payload})
        }
      }
    },
    async changeDetails(typeid,nodeid){
      const payload = {
        typeid: typeid,
        nodeid:nodeid,
        notebook:false
      }
      await this.$store.dispatch('notebook/fetchItems')
      await this.$store.dispatch('notebook/fetchDefaults',{payload})
      await this.$store.dispatch('design/fetchDetails',{payload})
      this.switch_prop = 0
    },
    /*
    async chengeDetailsTab(val){
      console.log("chengeDetailsTab",val)
      if(val == 1) this.conditionflag = true
      else this.conditionflag = false
      if(this.details.nodeid!=undefined && this.typeid != undefined){
        const payload = {
          typeid: Number(this.typeid),
          nodeid:this.details.nodeid,
          cluster:this.conditionflag
        }
        await this.$store.dispatch('notebook/fetchItems')
        await this.$store.dispatch('notebook/fetchDefaults',{payload})
        await this.$store.dispatch('design/fetchDetails',{payload})
      }
    },*/
    changeProperty(propnum, properties,cluster){
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"property_x":properties["properties"]["property_x"]}})
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"property_y":properties["properties"]["property_y"]}})
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"property_z":properties["properties"]["property_z"]}})
    },
    async changeConcept(){
      this.active_tab = 0
      var payload = {
        concept: this.concept_switch
      }
      try{
        await this.$store.dispatch('design/fetchTypes',{payload})
        await this.$store.dispatch('design/fetchNodes',{payload})
      } catch (e) {
        this.error = this.emsg
      }
      this.typename = this.types[this.active_tab].contents.fields.type_name
      this.typeid = this.types[this.active_tab].contents.pk
      this.newDetails()
      this.error=""
    },
    changeType(propnum,type,cluster){
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"datatype":type}})
    },
    setFigurename(propnum, figurename,cluster){
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"figure_name":figurename}})
      
    },
    async publishNode() {
      try {
        if(this.editflag==0){
          const payload = {
            typename: this.typename,
            concept: this.concept_switch
          }
          await this.publishType({payload})
        }
        else{
          const payload = {
            typeid: Number(this.typeid),
            typename: this.typename,
            concept: this.concept_switch
          }
          await this.editType({payload})
        }
        this.overlay = false
        this.targeterror = ""
      } catch (e) {
        this.targeterror = this.emsg
        if(Object.keys(this.targeterror).indexOf('type_name') != -1){
          this.targeterror["name"] = this.targeterror["type_name"]
        }
        console.log(this.error)
        if(this.emsg.code == "token_not_valid"){
          const cookies = new Cookies()
          cookies.remove('user', { path: '/' })
          cookies.remove('access'), { path: '/' }
          cookies.remove('refresh', { path: '/' })
          this.$store.commit('setUser', {token:null,user:null})
          this.$router.push('/login')
        }
      }
      this.typeid = this.types[this.active_tab].contents.pk
    },
    async deleteNode() {
      const payload = {
        typeid: Number(this.typeid),
        concept: this.concept_switch
      }
      try{
        await this.removeType({payload})
      } catch (e) {
        this.error = this.emsg
      }
    },
    async deleteDetails() {
      const payload = {
        typeid: Number(this.typeid),
        nodeid:this.details.nodeid
      }
      try{
        await this.removeDetail({payload})
        this.$store.commit('design/clearDetails')
        this.newDetails()
      } catch (e) {
        this.error = this.emsg
        console.log("this.error")
        console.log(this.error)
      }
    },
    async addItems(additems,cluster){
      if(additems.length > 0){
        for(var item_name of additems){
          var payload = {
              typeid: Number(this.typeid),
              nodeid:this.details.nodeid,
              item_name:item_name,
              design:true,
              cluster:cluster
          }
          try{
            var item_tmp = await this.publishItems({payload})
          } catch (e) {
            console.log(this.emsg)
          }
        }
        await this.$store.dispatch('notebook/fetchItems')
        await this.$store.dispatch('notebook/fetchDefaults',{payload})
      }
    },
    async removeItems(removeitems,cluster){
      if(removeitems.length > 0){
        for(var itemid of removeitems){
          var payload = {
              typeid: Number(this.typeid),
              nodeid:this.details.nodeid,
              itemid:itemid,
              cluster:cluster
          }
          try{
            var item_tmp = await this.removeDefaults({payload})
          } catch (e) {
            console.log(this.emsg)
          }
        }
        await this.$store.dispatch('notebook/fetchItems')
        await this.$store.dispatch('notebook/fetchDefaults',{payload})
      }
    },
    async sendForm(type_id,node_id,node_name,cropfile){
      var payload = {
        node_name:node_name,
        node_image:cropfile,
        nodeid:node_id,
        typeid:type_id
      }
      try{
        await this.editDetails({payload})
        var payload = {
          typeid: this.details.typeid,
          nodeid:this.details.nodeid
        }
        try{
          await this.$store.dispatch('design/fetchDetails',{payload})
        } catch (e) {
          this.error = this.emsg
        }
      } catch (e) {
          this.error = this.emsg
      }
      //this.$refs.fileInput.lazyValue = '';
    },
    ...mapActions('design', ['publishType','publishTemplate','editType','editDetails','editBlueprint','getBlueprint','removeFigure','removeType','removeDetail','removeEntity','fetchDetails','publishDetail','publishProperty']),
    ...mapActions('notebook', ['removeDefaults','publishItems','fetchDefaults','fetchItems'])

},
  mounted: function(){
    if(this.types !== null && this.types.length > 0){
      this.typename = this.types[0].contents.fields.type_name
      this.typeid = this.types[0].contents.pk
      this.newDetails()
    }
      this.handleResize();
      $(window).on('load resize', this.handleResize);

      canvas = new BaseCanvas("canvas");
      reader = new draw2d.io.json.Reader();
      /*
      for(var i=0;i<17; i++) {
        var label = new draw2d.shape.basic.Label({text:"I'm a Label2",stroke:0, fontColor:"#0d0d0d"});
        var fig = new CustomFigure({bgColor:"#FFFDE7"});//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
        fig.add(label, new draw2d.layout.locator.CenterLocator(this));
        canvas.add(fig,50,50+(i*50));
      }
      for(var i=0;i<8; i++) {
        var label = new draw2d.shape.basic.Label({text:"I'm a Label",stroke:0, fontColor:"#0d0d0d"});
        var fig = new CustomFigure({bgColor:"#E8F5E9"});//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
        fig.add(label, new draw2d.layout.locator.CenterLocator(this));
        canvas.add(fig,175+(i*125),100);
      }
      try{
        this.fitZoom();
      }catch(e){
        canvas.setZoom(1,true);
      }
      */
      reader.unmarshal(canvas, this.jsonDocument);
      this.displayJSON();

      var self = this;
      canvas.getCommandStack().addEventListener(function(e){
	      if(e.isPostChangeEvent()){
          self.displayJSON();
          self.stackChanged(e);
	      }
	    });
      canvas.on("select", async function(emitter,event){
        if(event["figure"] !== null){
          if(event["selection"]["primary"]["cssClass"] === "CustomFigure" || event["selection"]["primary"]["cssClass"] === "MaterialFigure" || event["selection"]["primary"]["cssClass"] === "ToolFigure"){
            event.figure.setStroke(6)
            if(event["figure"].userData != null){
              if(Object.keys(event["figure"].userData).length > 0){
                self.select_nodeid.push(event["figure"].userData["nodeid"]);
                self.select_boxid.push(event["figure"].id);

                self.typeid =  event["figure"].userData["typeid"]
                //self.changeDetails(Number(self.nodes.filter(proc => proc.contents.pk.indexOf(self.select_nodeid[0])>-1)[0].contents.typeid),self.select_nodeid[0])
                await self.changeDetails(self.typeid,self.select_nodeid[0])
                self.switch_prop = 0
                if(self.concept_switch != event["figure"].userData["concept_switch"]){
                  self.concept_switch =  event["figure"].userData["concept_switch"]
                  await self.changeConcept()
                }
                self.active_tab =  event["figure"].userData["active_tab"]//Number(self.nodes.filter(proc => proc.contents.pk.indexOf(self.select_nodeid[0])>-1)[0].id)
              }
            }
          }
        }
        self.deleteflag = true;
        self.displayJSON();
      });
      canvas.on("unselect", function(emitter,event){
        self.select_nodeid = [];
        self.select_boxid = [];
        self.deleteflag = false;
        self.displayJSON();
      });
  }
}



</script>
