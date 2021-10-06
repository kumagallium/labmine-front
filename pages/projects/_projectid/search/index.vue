<template>
  <v-main wrap>
    <Navi :project="project"></Navi>
    <v-container style="height: 100%;" fluid>
      <v-row class="px-10" style="height: 100%;">
        <v-col md="3">
          <v-card :color="subnavicolor" flat class="mt-6">
            <v-row>
              <v-col>
                <v-card flat class="px-5" :color="subnavicolor">
                  <v-text-field
                    flat
                    hide-details
                    label="Keywords"
                    prepend-icon="search"
                    v-model="keywords"
                    @change="changeList(1)"
                  ></v-text-field>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card flat class="px-5" :color="subnavicolor">
                  <v-text-field
                    flat
                    hide-details
                    label="Tags"
                    prepend-icon="tag"
                    v-model="tags"
                    @change="changeList(1)"
                  ></v-text-field>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-card flat class="px-5" :color="subnavicolor">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    @input="changeList(1)"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="dateRangeText"
                        label="Date range"
                        prepend-icon="event"
                        clearable
                        readonly
                        @click:clear="dates = [];changeList(1)"
                        v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="dates" range no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false;changeList(1)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-card>
              </v-col>
            </v-row>

          </v-card>
          <v-btn depressed color="primary" style="width:100%;" class="mt-2" @click="go2Note" :to="'/projects/'+project.id+'/notebook/'">Goto Notebook<v-icon small large>mdi-pencil</v-icon></v-btn>
        </v-col>

        <v-col md="9">
          <v-card flat style="height: 100%;" class="mt-3">
            <v-row no-gutters class="experiments">
              <v-col>
                <v-card flat class="experiments">
                  <v-data-table
                    :page.sync="page"
                    :headers="createHeaders"
                    :items="createItems"
                    :items-per-page="itemsPerPage"
                    :sort-by="['created_at']"
                    :sort-desc="[true]"
                    multi-sort
                    v-model="selectedExperiment"
                    item-key="id"
                    height="100%"
                    show-select
                    fixed-header
                    hide-default-footer
                  ></v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-card flat>
                  <v-pagination
                    v-model="page"
                    :length="Math.ceil(count/this.itemsPerPage)"
                    @input="changePage"
                  ></v-pagination>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

</template>


<style>
.tableblock {
  width:max-content;
  max-width:200%;

  -webkit-transform-origin:left top 0;
  -moz-transform-origin:left top 0;
  -ms-transform-origin:left top 0;
  -o-transform-origin:left top 0;
  transform-origin:left top 0;

  -webkit-transform:scale(0.5);
  -moz-transform:scale(0.5);
  -ms-transform:scale(0.5);
  -o-transform:scale(0.5);
  transform:scale(0.5);
}
.v-pagination {
    position: absolute;
    bottom: 0;
    height:fit-content;
    background-color:#ddd;
}
.submenu{
  height:50px;
  z-index:1;
}
.experiments{
  height:100%;
  overflow:scroll;
  z-index:0;
}
.v-data-table{
  height: calc(100% - 75px);
}
</style>

<script>
import Navi from '~/components/molecules/Navi.vue'
import ExperimentList from '~/components/molecules/ExperimentList.vue'
import ElementTable from '~/components/molecules/ElementTable.vue'
import Cookies from 'universal-cookie'
import {mapGetters, mapActions } from 'vuex'

export default {
  layout: 'project',
  components: {
    Navi,
    ExperimentList,
    ElementTable
  },
  async asyncData({ $axios,store,route,redirect }){
      $axios.setHeader('Authorization', "Bearer "+store.getters["access"])
      var project = await $axios.$get(`/api/v1/projects/${route.params.projectid}`)
                            .catch (error => {
                              console.log(error)
                            });
      if(!project)project = {"id":"","project_name":""}
      else{
        const payload = {
          projectid: project.id,
          page:1,
          keywords:"",
          tags:"",
          dates:[]
        }
        await store.dispatch('experiment/fetchExperiments',{payload})
      }
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
          dates: [],
          menu:false,
          menu2:false,
          eltext:"",
          elements:[],
          subnavicolor:"#E8EAF6",
          listmenucolor:"#9FA8DA",
          listcolor:"#E8EAF6",
          title: 'Hello Vue!!',
          page:1,
          itemsPerPage:10,
          pageCount: 0,
          keywords:"",
          tags:"",
          selectedExperiment:[],
      }
  },
  computed: {
     loggedInUser () {
       return this.$store.state.user
     },
     dateRangeText () {
       return this.dates.join(' ~ ')
    },
    createHeaders () {

      var headdef = {"id":"SID","title":"Recipename","tags":"Tags","editor":"Editor","created_at":"Date"}
      var headers = []
      for(var key of ["id","title","tags","editor","created_at"]){
        if(Object.keys(headdef).indexOf(key) >= 0){
          headers.push({text:headdef[key],value:key})
        }
      }
      return headers
    },
    createItems () {
      var items = this.experiments.map(exp => exp.contents.fields)
      for(var i in items){
        items[i]["id"] = this.experiments[i].contents.pk
      }
      return items
    },
    ...mapGetters({selectedlist:'experiment/selectedlist',experiments:'experiment/experiments',count:'experiment/count',next:'experiment/next',previous:'experiment/previous',emsg:'experiment/emsg'})
  },
  methods: {
    applyElement:function(val){
      this.elements = val.filter(Boolean);
      this.eltext = val.toString();
    },
    valElement:function(){
      this.elements = this.eltext.split(',').filter(Boolean);
      //this.elements = tmparray;
    },
    changePage:function(){
      this.changeList(this.page)
    },
    go2Note:function(){
      this.$store.commit('experiment/setList', {selectedlist:this.selectedExperiment.map(se => se.id)})
    },
    changeList:function(page){
      const payload = {
        projectid: this.project.id,
        page:page,
        itemsperpage:this.itemsPerPage,
        keywords:this.keywords,
        tags:this.tags,
        dates:this.dates
      }
      this.expriments = this.$store.dispatch('experiment/fetchExperiments',{payload})
                        .catch (error => {
                            const cookies = new Cookies()
                            cookies.remove('user')
                            cookies.remove('access')
                            cookies.remove('refresh')
                            this.$store.commit('setUser', {token:null,user:null})
                            this.$router.push('/login')
                        });
    },
  },
  mounted: function(){
  }
}
</script>

<style>
</style>
