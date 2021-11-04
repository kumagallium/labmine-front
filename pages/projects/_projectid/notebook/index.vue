<template>
  <v-main wrap>
    <Navi :project="project"></Navi>
    <v-container fluid style="height: 100%">
      <v-row style="height: 100%">
        <v-col md="6" class="pb-0 pr-0" :style="{height: '100%','position':flowview ? 'static' : 'absolute', 'z-index':flowview ? 0 : 1000, 'visibility':flowview ? 'visible' : 'hidden'}" >
          <!-- Left(Note) -->
          <v-card flat style="height: 100%" class="" color="rgb(0, 0, 0, 0.0)">
            <v-row>
              <v-col md="12" class="" style="height: 30px">
                <v-card flat style="height: 100%;" color="rgb(0, 0, 0, 0.0)">
                  <v-tabs
                    v-model="selectedrecipe"
                    class="recipe"
                    color="#aaa"
                    height="30px"
                    show-arrows
                    :items="recipes"
                    background-color="rgba(0, 0, 0, 0)"
                    @change="changedrecipe"
                  >
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab
                      v-for="(rc, index) in recipes"
                      :key="index"
                      :href="'#recipe-'+index"
                    >
                      {{ rc }}
                      <v-btn  v-if="(recipes.length >= 2)&('recipe-'+String(index)==selectedrecipe)" class="closetab mr-1" depressed x-small icon @click="closeRecipe">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-tab>
                    <v-btn outlined class="addtab pl-1 pr-1" style="height:100%;" min-width="20" @click="recipes.push('Untitled'+String(recipes.length+1))">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-tabs>
                </v-card>
              </v-col>
            </v-row>
            
            <v-row style="height: 100%;">
              <v-col md="12" class="" style="height: 100%">
                <v-card outlined flat class="pl-3 pr-3" style="height: 100%; position:relative;">
                  <!--v-btn :disabled="recipes.length < 2" depressed small class="closetab pl-2 pr-2" min-width="20" color="error" @click="closeRecipe">
                    <v-icon>mdi-window-minimize</v-icon>
                  </v-btn-->

                  <v-row style="height:60px;">
                    <v-col md="12" class="">
                      <v-card flat class="pt-2" color="rgb(0, 0, 0, 0.0)" style="height=100%;">
                        <v-row>
                          <v-col md="12" class="">
                            <v-text-field
                              dense
                              outlined
                              class="mt-1"
                              label="Recipe name"
                              placeholder="Recipe name"
                              v-model="recipename"
                              @change="changeRecipeName"
                              :error-messages="Object.keys(targeterror).indexOf('title') !== -1 ? [targeterror['title'][0]] : []"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="mt-3">
                      <v-expansion-panels
                        accordion
                        flat
                        v-if="this.plan != null"
                      >
                        <v-expansion-panel style="background-color:#eee;border-top:2px solid #FFF;">
                          <v-expansion-panel-header class="py-0 px-2" height="30px">
                            <v-card flat color="#eee" height="30px"><v-card-title class="py-0 text-h5 font-weight-bold">Plan</v-card-title></v-card>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content v-if="this.plan != null">
                            <Contents :images="plan_images" :headlines="headlines" :sentences="plan_sentences" :cluster="0" :error="targeterror" :details="details" :dataedit="dataedit" :boxid="plan != undefined ? plan.fields.boxid : ''" :entityid="plan != undefined ? plan.pk : ''" :defaults="defaults" :descriptions="plan_descriptions" :items="items" :notebook="true" :definitions="definitions" v-on:deleteimage="deleteimage" v-on:sendForm="sendForm" v-on:changedDescriptions="changedDescriptions" v-on:addItems="addItems" v-on:removeItems="removeItems"  v-on:changedSentences="changedSentences" v-on:addHeadlines="addHeadlines" v-on:removeHeadlines="removeHeadlines"></Contents>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <v-card v-else flat color="#eee" class="px-2" height="50px" @click="createPlan" :disabled="this.flowid==''">
                        <v-card-title class="py-2 text-h5 font-weight-bold">Plan</v-card-title>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row style="height: calc(100% - 120px);">
                    <v-col md="12" class="pt-0">
                      <v-card flat style="height=100%;" :disabled="this.flowid==''">
                        <v-card outlined flat id="workspace" style="overflow:auto;">
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

                          <v-btn v-if="deletefigflag+deleteconflag > 0" dark small fab color="indigo" v-on:click="deletefunc()">
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
            </v-row>
          </v-card>
        </v-col>
        <v-col :md="flowview ? 6 : 12" class="" style="height: 100%">
          <!-- Right(Contents) -->
          <!--v-textarea v-model="JSON.stringify(summarizeddata)"></v-textarea-->
          <v-sheet style="height: 100vh; margin-top:-12px;margin-bottom:-24px;" class="details pt-0 pl-0 pr-2 overflow-y-auto" color="rgb(0, 0, 0, 0.0)">
            
            <v-row v-show="!flowview">
              <v-col md="12" class="" style="height: 30px;margin-top:12px;">
                <v-card flat style="height: 100%;" color="rgb(0, 0, 0, 0.0)">
                  <v-tabs
                    v-model="selectedrecipe"
                    class="recipe"
                    color="#aaa"
                    height="30px"
                    show-arrows
                    :items="recipes"
                    background-color="rgba(0, 0, 0, 0)"
                    @change="changedrecipe"
                  >
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab
                      v-for="(rc, index) in recipes"
                      :key="index"
                      :href="'#recipe-'+index"
                    >
                      {{ rc }}
                      <v-btn v-if="(recipes.length >= 2)&('recipe-'+String(index)==selectedrecipe)" class="closetab mr-1" depressed x-small icon @click="closeRecipe">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-tab>
                    <v-btn outlined class="addtab pl-1 pr-1" style="height:100%;" min-width="20" @click="recipes.push('Untitled'+String(recipes.length+1))">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-tabs>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-show="flowview">
              <v-col md="12" class="py-0 mt-0" style="height: 30px;margin-top:12px;">
              </v-col>
            </v-row>
            <v-row style="height: 100%" class="mt-0">
              <v-col md="12" class="pt-0" style="height: 100%;">
                <v-card class="pl-2 pr-2">
                  <v-row v-show="!flowview" style="height:60px;margin-top:24px;">
                    <v-col md="12" class="pt-2">
                      <v-card flat class="pt-2 pb-0" color="rgb(0, 0, 0, 0.0)" style="height=100%;">
                        <v-row>
                          <v-col md="12" class="">
                            <v-text-field
                              dense
                              outlined
                              class="mt-1"
                              label="Recipe name"
                              placeholder="Recipe name"
                              v-model="recipename"
                              @change="changeRecipeName"
                              :error-messages="Object.keys(targeterror).indexOf('title') !== -1 ? [targeterror['title'][0]] : []"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row style="height:60px;">
                    <v-col md="12" class="pt-0 pb-0">
                      <!-- Tags -->
                      <v-card :disabled="this.flowid==''" flat class="pt-3 pb-0" color="rgb(0, 0, 0, 0.0)">
                        <v-combobox
                          v-model="setTags"
                          :items="tags"
                          label="Tags"
                          multiple
                          outlined
                          dense
                          small-chips
                          @change="changedTags"
                        ></v-combobox>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row v-if="error!=''">
                    <v-col md="11" class="pl-3 pt-0 pr-0 pb-0">   
                      <!-- ErrorBar -->  
                      <v-alert
                        dense
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

                  <v-row v-show="flowview && this.flowid!=''">
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
                  <v-row v-show="flowview && this.flowid!=''">
                    <v-col md="12" class="pl-3 pt-0 pr-3">
                      <!-- BlockField -->        
                      <v-card flat outlined style="overflow:auto;width:100%; height:100%;" class="mb-3">
                        <v-tabs  v-if="(types.length > 0) && (nodes.length == types.length)" dark background-color="indigo darken-3" left show-arrows v-model="active_tab">
                          <v-tabs-slider color="indigo lighten-3"></v-tabs-slider>
                          <v-tab v-for="(type,typeidx) of types" :key="typeidx" @click="changeTab(typeidx)">{{type.contents.fields.type_name}}</v-tab>
                        </v-tabs>
                        <v-tabs-items  v-if="(types.length > 0) && (nodes.length == types.length)" v-model="active_tab">
                          <v-tab-item v-for="(type,typeidx) of types" :key="typeidx">
                              <v-card flat class="ma-3">
                                <draggable :sort="false">
                                  <transition-group  type="transition">
                                    <v-card
                                      :ripple="false"
                                      flat
                                      outlined
                                      v-for="(proc, index)  of nodes[typeidx].contents.node_name"
                                      :key="proc"
                                      v-on:dragstart="startDrag"
                                      v-on:drag="doDrag"
                                      v-on:dragend="stopDrag"
                                      v-on:click="changeDetails(nodes[typeidx].contents.typeid,nodes[typeidx].contents.pk[index])"
                                      style="background-color:#eee;"
                                      class="text-center ma-1 float-left node"
                                    >
                                      {{proc}}
                                    </v-card>
                                  </transition-group>
                                </draggable>
                              </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-row v-if="!flowview">
                    <v-col md="12" class="pl-3 pr-3">
                      <!-- ContentField --> 
                      <v-card flat outlined style="overflow:hidden;width:100%;" class="mb-3" color="blue-grey lighten-5">
                        <v-row>
                          <v-col :md="4">
                            <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pb-0 text-h5 font-weight-bold">Plan</v-card-title></v-card>
                            <Contents2 v-if="Object.keys(summarizeddata).length > 0" :key="componentKey" :entityid="''" :summarizeddata="summarizeddata[clusterdict[0]]" :cluster="0" :error="targeterror" :dataedit="dataedit" :defaults="defaults" :descriptions="descriptions" :items="items" :notebook="true" :definitions="definitions"></Contents2>
                          </v-col>
                          <v-col :md="4">
                            <v-card  flat color="rgba(255, 255, 255, 0)"><v-card-title class="pb-0 text-h5 font-weight-bold">Methods</v-card-title></v-card>
                            <Contents2 v-if="Object.keys(summarizeddata).length > 0" :key="componentKey" :entityid="''" :summarizeddata="summarizeddata[clusterdict[1]]" :cluster="1" :error="targeterror" :dataedit="dataedit" :defaults="defaults" :descriptions="descriptions" :items="items" :notebook="true" :definitions="definitions"></Contents2>                           
                          </v-col>
                          <v-col :md="4">
                            <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pb-0 text-h5 font-weight-bold">Results</v-card-title></v-card>
                            <Contents2  v-if="Object.keys(summarizeddata).length > 0" :key="componentKey" :entityid="''" :summarizeddata="summarizeddata[clusterdict[2]]" :cluster="2" :error="targeterror" :dataedit="dataedit" :defaults="defaults" :descriptions="descriptions" :items="items" :notebook="true" :definitions="definitions"></Contents2>                           
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col md="12" class="pl-3 pr-3 pt-0">
                      <!-- ContentField --> 
                      <v-card v-if="(nodes.length > 0)&&(this.flowid!='')" flat outlined style="overflow:hidden;width:100%;" color="blue-grey lighten-5">
                        <v-row>
                          <v-col md="12" style="text-align:right;" class="pb-0">
                            <v-btn v-if="dataedit" text :ripple="false" style="height:100%;" @click="donecheck" class="pt-3 pb-0 pr-3">
                                <v-icon v-if="is_done">mdi-checkbox-marked</v-icon>
                                <v-icon v-else>mdi-checkbox-blank-outline</v-icon>Done
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col :md="12" class="py-0">
                            <v-expansion-panels
                              multiple
                              accordion
                              flat
                              class="mb-3"
                              :value="[0,1,2]"
                            >
                              <v-expansion-panel style="background-color:rgba(255, 255, 255, 0);">
                                <v-expansion-panel-header>
                                  <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="py-0 text-h5 font-weight-bold">Information</v-card-title></v-card>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <Details :notebook="true" :details="details" v-on:submitDetails="applyDetails"></Details>
                                </v-expansion-panel-content>
                              </v-expansion-panel>

                              <v-expansion-panel v-if="details.nodeid" style="background-color:rgba(255, 255, 255, 0);border-top:2px solid #FFF;">
                                <v-expansion-panel-header>
                                  <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pb-0 text-h5 font-weight-bold">Methods</v-card-title></v-card>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <Contents :images="images" :headlines="headlines" :sentences="sentences.filter(st => st.fields.cluster == 1)" :cluster="1" :error="targeterror" :dataedit="dataedit" :boxid="entity[0] != undefined ? entity[0].fields.boxid : ''" :entityid="entity[0] != undefined ? entity[0].pk : ''" :defaults="defaults" :descriptions="descriptions" :items="items" :datalist="datalist" :notebook="true" :definitions="definitions" :details="details" v-on:deleteimage="deleteimage" v-on:getDatalist="getDatalist" v-on:sendForm="sendForm" v-on:changedDescriptions="changedDescriptions" v-on:addItems="addItems" v-on:removeItems="removeItems" v-on:addProperty="addProperty" v-on:changeFigurename="setFigurename" v-on:changeProperty="changeProperty" v-on:changedData="changedData" v-on:changedSentences="changedSentences" v-on:addHeadlines="addHeadlines" v-on:removeHeadlines="removeHeadlines"></Contents>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                              
                              <v-expansion-panel v-if="details.nodeid &&(concept_switch==2)" style="background-color:rgba(255, 255, 255, 0);border-top:2px solid #FFF;">
                                <v-expansion-panel-header>
                                  <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="pb-0 text-h5 font-weight-bold">Results</v-card-title></v-card>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                <v-card flat color="rgba(255, 255, 255, 0)">
                                  <!-- DescriptionCards -->
                                  <v-card outlined flat class="ma-2 py-2 figure" :ripple="false" style="cursor: default;">
                                    <v-card flat color="rgba(255, 255, 255, 0)"><v-card-title class="py-0 text-h5">Product (Output Object)</v-card-title></v-card>
                                    <v-combobox :items="productlist" label="Product name" v-model="setProduct" outlined dense hide-details @change="changeProductname" class="my-2 mx-4" style="background-color:#fff;"></v-combobox>
                                  </v-card>
                                </v-card>
                                <Contents :images="images" :headlines="headlines" :sentences="sentences.filter(st => st.fields.cluster == 2)"  :cluster="2" :error="targeterror" :dataedit="dataedit" :boxid="entity[0] != undefined ? entity[0].fields.boxid : ''" :entityid="entity[0] != undefined ? entity[0].pk : ''" :defaults="defaults" :descriptions="descriptions" :items="items" :datalist="datalist" :notebook="true" :definitions="definitions" :details="details" v-on:deleteimage="deleteimage" v-on:getDatalist="getDatalist" v-on:sendForm="sendForm" v-on:changedDescriptions="changedDescriptions" v-on:addItems="addItems" v-on:removeItems="removeItems" v-on:addProperty="addProperty" v-on:changeFigurename="setFigurename" v-on:changeProperty="changeProperty" v-on:changedData="changedData" v-on:changedSentences="changedSentences" v-on:addHeadlines="addHeadlines" v-on:removeHeadlines="removeHeadlines"></Contents>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!--
                  <v-card flat outlined style="overflow:auto;width:100%; height:5%;" class="mb-3">
                      <textarea id="json" v-model="jsonDocument" v-on:change="changeJSON" style="overflow:auto;width:100%; height:100%;background:#f5f5f5;border:1px solid #eee;">
                      </textarea>
                    </v-card>
                  <v-card flat outlined style="overflow:auto;width:100%; height:5%;" class="mb-3">
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
      <v-btn :disabled="this.flowid==''" @click="flowview ^= 1;getdata(false);" elevation="2" icon outlined absolute style="top:3px;right:20px;background-color:white;z-index:1000;">
        <v-icon v-if="flowview">mdi-view-grid-outline</v-icon>
        <v-icon v-else>mdi-graph-outline</v-icon>
      </v-btn>
      <v-btn :disabled="this.flowid==''" @click="getdata(true)" elevation="2" icon outlined absolute style="top:3px;right:60px;background-color:white;z-index:1000;">
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-container>
  </v-main>
</template>

<style>
.v-window {
  height:calc(100% - 48px);
}
.v-window__container, .v-window-item {
  height:100%;
}
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
.recipe .v-slide-group a{
  background-color: #fff;

  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;

  border-top-left-radius: 5px;
  -moz-border-top-left-radius: 5px;
  -webkit-border-top-left-radius: 5px;
  -o-border-top-left-radius: 5px;
  -ms-border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  -moz-border-top-right-radius: 5px;
  -webkit-border-top-right-radius: 5px;
  -o-border-top-right-radius: 5px;
  -ms-border-top-right-radius: 5px;
}
.recipe .v-tab {
  text-transform: none !important;
}
.recipe .v-tab--active{
  color: #333;
  font-weight: bold;
}
.recipe .addtab{
  color: #555;
  background-color: #eee;

  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 0px solid #ddd;

  border-top-left-radius: 5px;
  -moz-border-top-left-radius: 5px;
  -webkit-border-top-left-radius: 5px;
  -o-border-top-left-radius: 5px;
  -ms-border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  -moz-border-top-right-radius: 5px;
  -webkit-border-top-right-radius: 5px;
  -o-border-top-right-radius: 5px;
  -ms-border-top-right-radius: 5px;
}
.closetab{
  position:absolute;
  right:0%;
  z-index:100;
}
.details{
  overflow-x: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;    /* IE, Edge 対応 */
  scrollbar-width: none;       /* Firefox 対応 */
}
.details::-webkit-scrollbar {  /* Chrome, Safari 対応 */
  display:none;
} 
</style>

<script>
import Navi from '~/components/molecules/Navi.vue'
import draggable from 'vuedraggable'
import Details from '~/components/molecules/Details.vue'
import Contents from '~/components/organisms/Contents.vue'
import Contents2 from '~/components/organisms/Contents2.vue'
import Products from '~/components/molecules/Products.vue'
import Cookies from 'universal-cookie'
import TargetEdit from '~/components/molecules/TargetEdit.vue'
import {mapGetters, mapActions } from 'vuex'

var canvas = null;
var reader = null;

export default {
  layout: 'project',
  components: { Navi,draggable,Details,Contents,Contents2,TargetEdit,Products },
  async asyncData({ $axios,store,route,redirect }){
      $axios.setHeader('Authorization', "Bearer "+store.state["access"])
      var project = await $axios.$get(`/api/v1/projects/${route.params.projectid}`)
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
        var payload = {
          experimentid: store.getters["experiment/selectedlist"]
        }
        if(payload.experimentid.length > 0){
          await store.dispatch('notebook/fetchNotebooks',{payload})
          await store.dispatch('notebook/fetchTags',{payload})
          await store.dispatch('notebook/fetchProducts',{payload})
        }
        var payload = {"concept":2}
        await store.dispatch('design/fetchTypes',{payload})
        await store.dispatch('design/fetchNodes',{payload})
        await store.dispatch('notebook/fetchItems')
        await store.dispatch('notebook/fetchHeadlines')
        await store.dispatch('design/fetchBlueprints')
        await store.dispatch('definition/fetchDefinitions')
      }
      return {project: project}
  },
  data:function () {
      return {
          dataedit:false,
          concept_switch:2,
          flowview:1,
          zoom:1,
          workspaceX:0,
          workspaceY:0,
          jsonDocument:[],
          deletefigflag:0,
          deleteconflag:0,
          undoflag:false,
          redoflag:false,
          clearflag:false,
          proclist:["Crushing","Cutting","Polishing","Annealing","Arc-melting","Sintering"],
          measurelist:["ZEM","XRD","Hall-effect","Leaser-flash"],
          otherlist:["Weighing"],
          product_name:"",
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
          selectedrecipe:null,
          newrecipeflag:0,
          recipes:[],
          recipename:"",
          is_done:false,
          clusterdict:{0:"plan",1:"methods",2:"results"},
          error:"",
          experimentdata:[1],
          targeterror:"",
          componentKey:0,
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
    setTags:{
      get() {
        return this.selectedtags
      },
    },
    productlist:{
      get() {
        if(this.products.length > 0) return this.products.map(pd=>pd.fields.product_name)
        else return []
      },
    },
    setProduct:{
      get() {
        if(Object.keys(this.selectedproduct).length > 0){
          return this.selectedproduct.fields.product_name
        }
      },
      set(val) {
        this.product_name = val
      }
    },
     ...mapGetters({plan:'design/plan',selectedlist:'experiment/selectedlist',summarizeddata:'notebook/summarizeddata',data:'notebook/data',selectedproduct:'notebook/selectedproduct',products:'notebook/products',images:'notebook/images',plan_images:'notebook/plan_images',datalist:'notebook/datalist',defaults:'notebook/defaults',descriptions:'notebook/descriptions',sentences:'notebook/sentences',plan_descriptions:'notebook/plan_descriptions',plan_sentences:'notebook/plan_sentences',items:'notebook/items',headlines:'notebook/headlines',tags:'notebook/tags',selectedtags:'notebook/selectedtags',entity:'notebook/entity',notebooks:'notebook/notebooks',types:'design/types',nodes:'design/nodes',template:'design/template',templates:'design/templates',details:'design/details',emsg:'design/emsg',definitions:'definition/definitions'})
  },
  methods: {
    // Right-side
    async selecttemplate(val){
      if(this.notebooks[Number(this.selectedrecipe.split("-")[1])] != undefined){
        this.flowid = this.notebooks[Number(this.selectedrecipe.split("-")[1])].fields.blueprint
      }
      this.selectid = val.id
      var payload = {
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
      if(this.plan != null){
        var payload = {
          entityid: this.plan.pk
        }
        try{
          await this.$store.dispatch('notebook/fetchPlanData',{payload})
        }catch (e) {
          this.error = this.emsg
        }
      }
    },
    newflow:function(){
      this.flowid = ""
      this.selectid = ""
      this.select_nodeid = [];
      this.select_boxid = [];
      try{
        this.$store.commit('design/clearTemplate')
        this.$store.commit('design/clearPlan')
        this.$store.commit('notebook/clearPlan')
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
    async changedTags(val){
      var deletetags = this.selectedtags.filter(st => val.indexOf(st)<0)
      var addtags = val.filter(f => this.selectedtags.indexOf(f)<0)
      if(deletetags.length > 0 || addtags.length > 0){
        for(var tag_name of addtags){
          var payload = {
              experimentid:[this.notebooks[Number(this.selectedrecipe.split("-")[1])].pk],
              tag_name:tag_name
          }
          try{
            await this.publishTags({payload})
          } catch (e) {
            console.log(this.emsg)
          }
        }
        for(var tag_name of deletetags){
          var payload = {
              experimentid:[this.notebooks[Number(this.selectedrecipe.split("-")[1])].pk],
              tag_name:tag_name
          }
          try{
            await this.removeTags({payload})
          } catch (e) {
            console.log(this.emsg)
          }
        }
        await this.$store.dispatch('notebook/fetchTags',{payload})
      }
    },
    async addHeadlines(addheadlines,cluster){
      if(addheadlines.length > 0){
        for(var headline_name of addheadlines){
          if(cluster==0){
            var payload = {
                typeid: Number(this.typeid),
                nodeid:this.details.nodeid,
                headline_name:headline_name,
                entityid: this.plan.pk,
                cluster:cluster
            }
            try{
              var headline_tmp = await this.publishHeadlines({payload})
            } catch (e) {
              console.log(this.emsg)
            }
            await this.$store.dispatch('notebook/fetchHeadlines')
            await this.$store.dispatch('notebook/fetchPlanData',{payload})
          }
          else{
            var payload = {
                typeid: Number(this.typeid),
                nodeid:this.details.nodeid,
                headline_name:headline_name,
                entityid: this.entity[0].pk,
                cluster:cluster
            }
            try{
              var headline_tmp = await this.publishHeadlines({payload})
            } catch (e) {
              console.log(this.emsg)
            }
            await this.$store.dispatch('notebook/fetchHeadlines')
            await this.$store.dispatch('notebook/fetchSentences',{payload})
          }
        }
      }
    },
    async removeHeadlines(removeheadlines,cluster){
      if(removeheadlines.length > 0){
        for(var headlineid of removeheadlines){
          if(cluster==0){
            var payload = {
                typeid: Number(this.typeid),
                nodeid:this.details.nodeid,
                headlineid:headlineid,
                entityid: this.plan.pk,
                cluster:cluster
            }
            try{
              var headline_tmp = await this.removeSentences({payload})
            } catch (e) {
              console.log(this.emsg)
            }
            await this.$store.dispatch('notebook/fetchHeadlines')
            await this.$store.dispatch('notebook/fetchPlanData',{payload})
          }
          else{
            var payload = {
                typeid: Number(this.typeid),
                nodeid:this.details.nodeid,
                headlineid:headlineid,
                entityid: this.entity[0].pk,
                cluster:cluster
            }
            try{
              var headline_tmp = await this.removeSentences({payload})
            } catch (e) {
              console.log(this.emsg)
            }
            await this.$store.dispatch('notebook/fetchHeadlines')
            await this.$store.dispatch('notebook/fetchSentences',{payload})
          }
        }
      }
    },
    async addItems(additems,cluster){
      if(additems.length > 0){
        for(var item_name of additems){
          if(cluster==0){
            var payload = {
                typeid: Number(this.typeid),
                item_name:item_name,
                design:false,
                entityid: this.plan.pk,
                cluster:cluster
            }
            try{
              var item_tmp = await this.publishItems({payload})
            } catch (e) {
              console.log(this.emsg)
            }
            await this.$store.dispatch('notebook/fetchItems')
            await this.$store.dispatch('notebook/fetchPlanData',{payload})
          }
          else{
            var payload = {
                typeid: Number(this.typeid),
                nodeid:this.details.nodeid,
                item_name:item_name,
                design:false,
                entityid: this.entity[0].pk,
                cluster:cluster
            }
            await this.$store.dispatch('notebook/fetchDefaults',{payload})
            try{
              var item_tmp = await this.publishItems({payload})
            } catch (e) {
              console.log(this.emsg)
            }
            await this.$store.dispatch('notebook/fetchItems')
            await this.$store.dispatch('notebook/fetchDescriptions',{payload})
          }
        }
      }
    },
    async removeItems(removeitems,cluster){
      if(removeitems.length > 0){
        for(var itemid of removeitems){
          if(cluster==0){
            var payload = {
                typeid: Number(this.typeid),
                itemid:itemid,
                entityid: this.plan.pk,
                cluster:cluster
            }
            try{
              var item_tmp = await this.removeDescriptions({payload})
            } catch (e) {
              console.log(this.emsg)
            }
            await this.$store.dispatch('notebook/fetchItems')
            await this.$store.dispatch('notebook/fetchPlanData',{payload})
          }
          else{
            var payload = {
                typeid: Number(this.typeid),
                nodeid:this.details.nodeid,
                itemid:itemid,
                entityid: this.entity[0].pk,
                cluster:cluster
            }
            await this.$store.dispatch('notebook/fetchDefaults',{payload})
            
            try{
              var item_tmp = await this.removeDescriptions({payload})
            } catch (e) {
              console.log(this.emsg)
            }
            await this.$store.dispatch('notebook/fetchItems')
            await this.$store.dispatch('notebook/fetchDescriptions',{payload})
          }
        }
      }
    },
    async changedDescriptions(itemid,descriptions,cluster){
      //publishDescriptions
      if(cluster==0){
        var payload = {
            itemid:itemid,
            entityid: this.plan.pk,
            values:descriptions,
            cluster:cluster
        }
        try{
          await this.publishDescriptions({payload})
        } catch (e) {
          console.log(this.emsg)
        }
        await this.$store.dispatch('notebook/fetchPlanData',{payload})
      }
      else{
        var payload = {
            itemid:itemid,
            entityid: this.entity[0].pk,
            values:descriptions,
            cluster:cluster
        }
        try{
          await this.publishDescriptions({payload})
        } catch (e) {
          console.log(this.emsg)
        }
        await this.$store.dispatch('notebook/fetchDescriptions',{payload})
      }
    },
    async changedSentences(headlineid,sentences,cluster){
      if(typeof headlineid == "string" ){
          if(cluster==0){
            var payload = {
                typeid: Number(this.typeid),
                nodeid:this.details.nodeid,
                headline_name:headlineid,
                entityid: this.plan.pk
            }
          }
          else{
            var payload = {
                typeid: Number(this.typeid),
                nodeid:this.details.nodeid,
                headline_name:headlineid,
                entityid: this.entity[0].pk
            }
          }
          try{
            headlineid = await this.publishHeadlines({payload})
          } catch (e) {
            console.log(this.emsg)
          }
      }
      //publishSentences
      if(cluster==0){
        var payload = {
            headlineid:headlineid,
            entityid: this.plan.pk,
            value:sentences,
            cluster:cluster
        }
        try{
          await this.publishSentences({payload})
        } catch (e) {
          console.log(this.emsg)
        }
        await this.$store.dispatch('notebook/fetchPlanData',{payload})
      }
      else{
        var payload = {
            headlineid:headlineid,
            entityid: this.entity[0].pk,
            value:sentences,
            cluster:cluster
        }
        try{
          await this.publishSentences({payload})
        } catch (e) {
          console.log(this.emsg)
        }
        await this.$store.dispatch('notebook/fetchSentences',{payload})
      }
    },
    closeRecipe:function(){
      this.recipes.splice(Number(this.selectedrecipe.split('-')[1]), 1)
      this.$store.commit('notebook/removeNotebookList', {idx:Number(this.selectedrecipe.split('-')[1])})
      this.$store.commit('experiment/removeList', {idx:Number(this.selectedrecipe.split('-')[1])})
      this.changedrecipe(this.selectedrecipe)
    },
    async changedrecipe(val){
      if(val!=undefined){
        this.recipename = this.recipes[Number(val.split("-")[1])]
        if(this.notebooks.filter(note => note.fields.title == this.recipename)[0] == undefined){
          this.newflow()
          this.newrecipeflag = 0
        }
        else{
          var payload = {
              experimentid:[this.notebooks[Number(this.selectedrecipe.split("-")[1])].pk]
          }
          await this.$store.dispatch('notebook/fetchTags',{payload})
          if(this.templates.filter(temp => temp.pk == this.notebooks.filter(note => note.fields.title == this.recipename)[0].fields.blueprint)[0] == undefined){
            var val = {flowname:"",pk:this.notebooks.filter(note => note.fields.title == this.recipename)[0].fields.blueprint,id:""}
            this.selecttemplate(val)
          }
          else{
            var val = {flowname:this.templates.filter(temp => temp.pk == this.notebooks.filter(note => note.fields.title == this.recipename)[0].fields.blueprint)[0].flowname,pk:this.notebooks.filter(note => note.fields.title == this.recipename)[0].fields.blueprint,id:this.templates.filter(temp => temp.pk == this.notebooks.filter(note => note.fields.title == this.recipename)[0].fields.blueprint)[0].id}
            this.selecttemplate(val)
          }
          this.newrecipeflag = 1
          if(!this.flowview){
            this.getdata(false)
          }
        }
      }
    },
    async changeRecipeName(val){
      if(this.notebooks[Number(this.selectedrecipe.split("-")[1])] == undefined){
        if(typeof this.jsonDocument === "object") this.jsonDocument=JSON.stringify(this.jsonDocument,null,2)
        var payload = {
          projectid:this.project.id,
          recipename:val,
          template: JSON.parse(this.jsonDocument)
        }
        try{
          var newexp = await this.publishExperiment({payload})
          this.targeterror = ""
          var newexpid = newexp.id
          this.flowid = newexp.blueprint_id
          this.$store.commit('experiment/addList', {newexp:newexpid})
          this.recipes[Number(this.selectedrecipe.split("-")[1])] = val
          this.recipes.push("")
          this.recipes.pop()

          var payload = {
            experimentid: this.$store.getters["experiment/selectedlist"]
          }
          if(payload.experimentid.length > 0){
            await this.$store.dispatch('notebook/fetchNotebooks',{payload})
            await this.$store.dispatch('notebook/fetchTags',{payload})
          }
        } catch (e) {
          this.targeterror = this.emsg
        }
      }
      else{
        var payload = {
          experimentid:this.notebooks[Number(this.selectedrecipe.split("-")[1])].pk,
          recipename:val
        }
        try{
          await this.editExperiment({payload})
        } catch (e) {
          this.targeterror = this.emsg
        }
        this.recipes[Number(this.selectedrecipe.split("-")[1])] = val
        this.recipes.push("")
        this.recipes.pop()
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
      if(this.flowid != ""){
        const payload = {
          flowid:this.flowid,
          template: JSON.parse(this.jsonDocument),
          flowname: this.flowname
        }
        await this.editBlueprint({payload})
      }
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
      this.deletefigflag=0
      this.deleteconflag=0
      this.dataedit = false
      reader.unmarshal(canvas, this.jsonDocument);
      try{
        this.fitZoom();
      }catch(e){
        canvas.setZoom(1,true);
      }
    },
    handleResize:function(){
      var wH = $(window).height();
      $('#workspace').css('height',wH-200+'px');
      this.workspaceY = wH-200
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
    async deleteimage(image){
      var payload = {
          imageid: image.pk
      }
      try{
        var headline_tmp = await this.removeImages({payload})
      } catch (e) {
        console.log(this.emsg)
      }
      var payload = {
        entityid: this.entity[0].pk
      }
      await this.$store.dispatch('notebook/fetchImages',{payload})
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
    startDrag:function(event) {
      this.offsetx = event.offsetX;
      this.offsety = event.offsetY;
    },
    stopDrag:function(event) {
      if("svg" == document.elementFromPoint(event.clientX, event.clientY).tagName){
        var currentZoom = canvas.getZoom();
        var nodeid = this.nodes[this.active_tab].contents.pk[this.nodes[this.active_tab].contents.node_name.indexOf(this.dragname)]
        if(this.dragname.length > 10) this.dragname = this.dragname.substr(0,10)+"...";
        var label = new draw2d.shape.basic.Label({text:this.dragname,stroke:0, fontColor:"#0d0d0d"});
        if(this.concept_switch==0){
          var tagtext = "M"
          var tagcolor = "#3949AB"
          var fig = new MaterialFigure({bgColor:this.dragcolor});//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
        }
        else if(this.concept_switch==1){
          var tagtext = "T"
          var tagcolor = "#00897B"
          var fig = new ToolFigure({bgColor:this.dragcolor});//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
        }
        else {
          var tagtext = "A"
          var tagcolor = "#E53935"
          var fig = new CustomFigure({bgColor:this.dragcolor});//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
        }
        var tag = new draw2d.shape.basic.Label({text:tagtext, stroke:0, bgColor :tagcolor, height:25, width:20, fontColor:"#fff", radius:2});
        fig.add(label, new draw2d.layout.locator.RightLocator({margin:-80}));
        fig.add(tag, new draw2d.layout.locator.RightLocator({margin:-100}));
        fig.attr('userData', {"nodeid":nodeid,"typeid":this.typeid,"concept_switch":this.concept_switch,"active_tab":this.active_tab}); 
        canvas.add(fig,this.canvasx*currentZoom,this.canvasy*currentZoom);
        this.displayJSON();
        this.updateflow()
      }

    },

    // Left-side
    doDrag:function(event) {
      if("svg" == document.elementFromPoint(event.clientX, event.clientY).tagName){
        var currentZoom = canvas.getZoom();
        this.dragname = event.srcElement.innerHTML.trim();
        //this.dragcolor = event.srcElement.style.backgroundColor;
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
      this.$store.commit('design/updateDetail',{input:{"figures":[{"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":0},
                                                        {"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":1}]}})
    },
    addDetails:function(){
      this.newDetails()
    },
    addProperty:function(propnum,cluster){
      if(propnum==0){
        this.$store.commit('design/updateDetail',{input:{"figures":[{"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":cluster}]}})
      }
      else{
        this.$store.commit('design/pushFigure',{input:{"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":cluster}})
      }
    },
    async getDatalist(){
      var payload = {
        entityid: this.entity[0].pk
      }
      await this.$store.dispatch('notebook/fetchData',{payload})
    },
    async changeDetails(typeid,nodeid){
      var payload = {
        typeid: typeid,
        nodeid:nodeid,
        notebook:true
      }
      await this.$store.dispatch('notebook/fetchItems')
      await this.$store.dispatch('notebook/fetchHeadlines')
      await this.$store.dispatch('notebook/fetchDefaults',{payload})
      await this.$store.dispatch('design/fetchDetails',{payload})
      this.switch_prop = 0
      if(this.dataedit == true){
        if(this.flowid!=""  && this.select_boxid!=[]){
          var payload = {
            flowid: Number(this.flowid),
            nodeid:nodeid,
            boxid:this.select_boxid[0]
          }
          try{
            await this.$store.dispatch('notebook/fetchEntity',{payload})

            if (this.entity[0] != undefined){
              this.dataedit = true
              var payload = {
                entityid: this.entity[0].pk
              }
              await this.$store.dispatch('notebook/fetchData',{payload})
              await this.$store.dispatch('notebook/fetchImages',{payload})
              await this.$store.dispatch('notebook/fetchSelectedProduct',{payload})
              await this.$store.dispatch('notebook/fetchDescriptions',{payload})
              await this.$store.dispatch('notebook/fetchSentences',{payload})
            }
            else{
              this.dataedit = false
            }
            
          } catch (e) {
            this.error = this.emsg
          }
        }
      }
      else{
        this.$store.commit('notebook/clearEntity')
        this.$store.commit('notebook/clearDatalist')
        this.$store.commit('notebook/clearImages')
      }
    },
    /*
    async chengeDetailsTab(val){
      console.log("chengeDetailsTab",val)
      if(val == 1) this.conditionflag = true
      else this.conditionflag = false
      console.log("chengeDetailsTab",this.conditionflag)
      if(this.details.nodeid!=undefined && this.typeid != undefined){
        var payload = {
          typeid: Number(this.typeid),
          nodeid:this.details.nodeid,
          cluster:this.conditionflag
        }
        await this.$store.dispatch('notebook/fetchDefaults',{payload})
        await this.$store.dispatch('design/fetchDetails',{payload})
        if(this.entity.length > 0){
          var payload = {
            entityid: this.entity[0].pk,
            cluster:this.conditionflag
          }
          await this.$store.dispatch('notebook/fetchData',{payload})
          await this.$store.dispatch('notebook/fetchDescriptions',{payload})
          await this.$store.dispatch('notebook/fetchSentences',{payload})
        }
      }
    },*/
    changeProperty(propnum, properties,cluster){
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"property_x":properties["properties"]["property_x"]}})
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"property_y":properties["properties"]["property_y"]}})
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"property_z":properties["properties"]["property_z"]}})
    },
    async changeConcept(){
      var payload = {
        concept: this.concept_switch
      }
      try{
        await this.$store.dispatch('design/fetchTypes',{payload})
        await this.$store.dispatch('design/fetchNodes',{payload})
      } catch (e) {
        this.error = this.emsg
      }
      this.active_tab = 0
    },
    donecheck(){
      this.is_done ^= true
      var arrowjson = canvas.lines.data.filter(ln => ln["sourcePort"]["parent"]["id"]==this.select_boxid[0])
      var selectfig =  canvas.figures.data.filter(fig => fig["id"]==this.select_boxid[0])
      for(var arr of arrowjson){
          if(this.is_done) canvas.lines.data.filter(jt => jt["id"]==arr["id"])[0].setColor("#ff0000")
          else canvas.lines.data.filter(jt => jt["id"]==arr["id"])[0].setColor("#aaaaaa")
      }
      selectfig[0].outputPorts.data[0].userData = {"is_done":this.is_done}
      this.displayJSON()
      this.updateflow()
    },
    async changedData(data){
      if(this.entity.length > 0){
        const payload = {
          figureid:data.figureid,
          data:data.data,
          entityid:this.entity[0].pk,
          unit_x: data.units.unit_x.id,
          unit_y: data.units.unit_y.id,
          unit_z: data.units.unit_z.id,
        }
        var arrowjson = canvas.lines.data.filter(ln => ln["sourcePort"]["parent"]["id"]==this.select_boxid[0])
        var selectfig =  canvas.figures.data.filter(fig => fig["id"]==this.select_boxid[0])
        for(var arr of arrowjson){
          canvas.lines.data.filter(jt => jt["id"]==arr["id"])[0].setColor("#ff0000")
        }
        selectfig[0].outputPorts.data[0].userData = {"is_data":true}
        this.deletefigflag = -1
        try{
          await this.publishData({payload})
          this.updateflow()
          await this.$store.dispatch('notebook/fetchData',{payload})
        } catch (e) {
          this.targeterror = this.emsg
        }
        this.dataedit = true
        this.getDatalist()
    }
              
    },
    setFigurename(propnum, figurename,cluster){
      this.$store.commit('design/updateFigure',{cluster:cluster, propnum:propnum, input:{"figure_name":figurename}})
      
    },
    async createPlan() {
      if(canvas.figures.data.length == 0){
          var currentZoom = canvas.getZoom();
          this.dragname = "Plan";
          var label = new draw2d.shape.basic.Label({text:this.dragname,stroke:0, fontColor:"#0d0d0d"});
          var fig = new PlanFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
          fig.add(label, new draw2d.layout.locator.CenterLocator());
          canvas.add(fig,this.canvasx*currentZoom,this.canvasy*currentZoom);
          this.displayJSON();
          var boxid = fig.id
          this.updateflow()

          const payload = {
            blueprintid: this.flowid,
            boxid: boxid
          }
          await this.publishPlan({payload})
      }
      else{
        if(canvas.figures.data.filter(fig => fig.cssClass == "PlanFigure").length == 0){
          var currentZoom = canvas.getZoom();
          this.dragname = "Plan";
          var label = new draw2d.shape.basic.Label({text:this.dragname,stroke:0, fontColor:"#0d0d0d"});
          var fig = new PlanFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});//new reader.createFigureFromType("CustomFigure");//CustomFigure();//draw2d.shape.basic.Rectangle({width:100, height:25});
          fig.add(label, new draw2d.layout.locator.CenterLocator());
          canvas.add(fig,this.canvasx*currentZoom,this.canvasy*currentZoom);
          this.displayJSON();
          var boxid = fig.id
          this.updateflow()

          const payload = {
            blueprintid: this.flowid,
            boxid: boxid
          }
          await this.publishPlan({payload})
        }
      }
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
            typename: this.typename
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
      } catch (e) {
        this.error = this.emsg
        console.log("this.error")
        console.log(this.error)
      }
    },
    async sendForm(image_name,cluster,entityid,cropfile){
      if(cluster==0){
        var payload = {
            image_name:image_name,
            image:cropfile,
            cluster:cluster,
            entityid:this.plan.pk,
        }
        await this.publishImage({payload})
        await this.$store.dispatch('notebook/fetchPlanData',{payload})
      }
      else{
        var payload = {
            image_name:image_name,
            image:cropfile,
            cluster:cluster,
            entityid:entityid,
        }
        await this.publishImage({payload})
        await this.$store.dispatch('notebook/fetchImages',{payload})
      }
      try{
      } catch (e) {
        console.log(e)
      }
      //this.$refs.fileInput.lazyValue = '';
    },
    async getdata(saveflag){
      //this.experimentdata = this.jsonDocument//JSON.stringify(this.details)

      if(this.notebooks[Number(this.selectedrecipe.split("-")[1])] != undefined){
        var payload = {
            experimentid:this.notebooks[Number(this.selectedrecipe.split("-")[1])].pk,
        }
        try{
          await this.$store.dispatch('notebook/getSummarizedData',{payload})
          //await this.$store.dispatch('notebook/getData',{payload})
        } catch (e) {
          console.log(this.emsg)
        }
        this.experimentdata = JSON.stringify(this.summarizeddata)
        this.forceRerender()
        //this.experimentdata = JSON.stringify(this.data)

        if(saveflag){
          const blob = new Blob([this.experimentdata], {type: 'text/plain'})
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = this.recipename+".json"
          link.click()
        }
      }
      
    },
    async changeProductname(){
      if(Object.keys(this.selectedproduct).length > 0){
        var payload = {
          product_name:this.product_name,
          entityid: this.entity[0].pk,
          productid:this.selectedproduct.fields.product
        }
        try{
          await this.editProduct({payload})
        } catch (e) {
          this.targeterror = this.emsg
        }

        var payload = {
          entityid: this.entity[0].pk
        }
        await this.$store.dispatch('notebook/fetchSelectedProduct',{payload})
      }
      else{
        var payload = {
          product_name:this.product_name,
          experimentid:[this.notebooks[Number(this.selectedrecipe.split("-")[1])].pk]
        }
        try{
          var product_tmp = await this.publishProducts({payload})
        } catch (e) {
          this.targeterror = this.emsg
        }
        var payload = {
              entityid: this.entity[0].pk,
              productid:product_tmp.id
          }
        try{
          await this.publishDefinitions({payload})
        } catch (e) {
          this.targeterror = this.emsg
        }
      }

      var payload = {
        entityid: this.entity[0].pk,
        experimentid:[this.notebooks[Number(this.selectedrecipe.split("-")[1])].pk]
      }
      try{
        await this.fetchProducts({payload})
        await this.$store.dispatch('notebook/fetchSelectedProduct',{payload})
      } catch (e) {
        this.targeterror = this.emsg
      }
    },
    forceRerender() {
      this.componentKey += 1;
    },
    ...mapActions('design', ['publishExperiment','publishType','publishTemplate','editType','editDetails','editBlueprint','getBlueprint','removeType','removeDetail','removeEntity','fetchDetails','publishDetail','publishProperty']),
    ...mapActions('notebook', ['fetchPlanData','publishPlan','editProduct','fetchSelectedProduct','fetchProducts','publishDefinitions','publishProducts','getSummarizedData','getData','fetchImages','publishImage','removeImages','removeSentences','publishSentences','removeDescriptions','publishDescriptions','publishHeadlines','publishItems','fetchDefaults','fetchSentences','fetchDescriptions','editExperiment','fetchHeadlines','fetchItems','fetchTags','removeTags','publishTags','publishData','fetchData','fetchEntity','fetchNotebook'])
  },
  mounted: function(){
    if(this.types !== null && this.types.length > 0){
      this.typename = this.types[0].contents.fields.type_name
      this.typeid = this.types[0].contents.pk
      this.newDetails()
    }

    this.recipes = this.notebooks.map(note => note.fields.title)
    if(this.recipes.length <= 0) this.recipes.push('Untitled'+String(this.recipes.length+1))

    this.handleResize();
    $(window).on('load resize', this.handleResize);

    canvas = new BaseCanvas("canvas");
    reader = new draw2d.io.json.Reader();
    reader.unmarshal(canvas, this.jsonDocument);
    this.displayJSON();

    var self = this;
    canvas.getCommandStack().addEventListener(function(e){
      if(e.isPostChangeEvent()){
        if(e.action !== undefined){
          self.displayJSON();
          if(e.command.source != undefined){
            if(e.command.source.userData["is_done"]){
              var conid = e.command.connection.id
              canvas.lines.data.filter(con => con.id == conid)[0].setColor("#ff0000")
            }
          }
          self.stackChanged(e);
          self.updateflow()
        }
      }
    });
    canvas.on("select", async function(emitter,event){
      if(event.figure !== null){
        if(event.selection.primary.cssClass === "CustomFigure" || event["selection"]["primary"]["cssClass"] === "MaterialFigure" || event["selection"]["primary"]["cssClass"] === "ToolFigure"){
          if(event.selection.all.data.filter(sel => sel.cssClass === "CustomFigure").filter(sel => sel.outputPorts.data[0].userData["is_data"]).length > 0 || event.selection.all.data.filter(sel => sel.cssClass === "MaterialFigure").filter(sel => sel.outputPorts.data[0].userData["is_data"]).length > 0 || event.selection.all.data.filter(sel => sel.cssClass === "ToolFigure").filter(sel => sel.outputPorts.data[0].userData["is_data"]).length > 0) self.deletefigflag = -1
          else self.deletefigflag = 1
          if(event.selection.primary.outputPorts.data[0].userData["is_done"]) self.is_done = true
          else self.is_done = false
          event.figure.setStroke(2)
          if(event.figure.userData != null){
            if(Object.keys(event.figure.userData).length > 0){
              self.select_nodeid.push(event.figure.userData["nodeid"]);
              self.select_boxid.push(event.figure.id);
              if(canvas.selection.all.data.length==1){
                //self.active_tab = Number(self.nodes.filter(proc => proc.contents.pk.indexOf(self.select_nodeid[0])>-1)[0].id)
                //self.changeDetails(Number(self.nodes.filter(proc => proc.contents.pk.indexOf(self.select_nodeid[0])>-1)[0].contents.typeid),self.select_nodeid[0])
                self.switch_prop = 0
                self.dataedit = true

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
        else{
          self.deleteconflag = 1;
        }
        self.displayJSON();
      }
    });
    canvas.on("unselect", function(emitter,event){
      if(event.figure !== null){
        if(event.figure.cssClass === "CustomFigure" || event.figure.cssClass === "MaterialFigure" || event.figure["cssClass"] === "ToolFigure"){
          event.figure.setStroke(0)
        }
      }
      //if(self.select_boxid.length > 0) canvas.figures.data.filter(fig => fig["id"]==self.select_boxid[0])[0].setStroke(1)
      self.select_nodeid = [];
      self.select_boxid = [];
      self.deletefigflag = 0;
      self.deleteconflag = 0;
      self.dataedit = false
      self.$store.commit('notebook/clearEntity')
      self.$store.commit('notebook/clearDatalist')
      self.$store.commit('notebook/clearImages')
      self.displayJSON();
    });
  }
}



</script>
