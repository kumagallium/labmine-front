<template>
  <v-main wrap>
    <Navi :project="project"></Navi>
    <v-container fill-height fluid>
      <v-row style="height: 100%;">
        <v-col class="px-5" style="height: 100%;" md="6">
          <v-row>
            <v-col class="pb-0">
              <v-card>
                <v-toolbar flat dark height="50px" color="#203864">
                  <v-toolbar-title>Add Form</v-toolbar-title>
                </v-toolbar>
                <v-row>
                  <v-col md="6">
                    <v-card flat>
                      <v-combobox
                        v-model="propselect"
                        :items="definitions.map(item => item.name)"
                        label="Properties"
                        outlined
                        dense
                        class="pl-5 pt-4"
                        :error-messages="Object.keys(error).indexOf('protect_error') !== -1 ? error['protect_error'] : []"
                        :disabled="createflag!=0"
                      ></v-combobox>
                    </v-card>
                  </v-col>
                  <v-col md="6">
                    <v-card flat>
                      <v-combobox
                        v-model="unitselect"
                        :items="propselect !== '' && definitions.map(item => item.name).indexOf(propselect) >= 0 ? definitions.filter(def => def.name ===propselect)[0].children.map(ch => ch.name) : []"
                        v-on:input="inputunit"
                        label="Units"
                        outlined
                        dense
                        v-on:keyup="inputUnit"
                        :error-messages="Object.keys(results).indexOf('error') !== -1 ? [results['error']] : []"
                        class="pr-5 pt-4"
                      ></v-combobox>
                    </v-card>
                  </v-col>
                </v-row>

                <v-card-actions class="pt-0">
                  <v-spacer></v-spacer>
                  <v-btn v-if="Object.keys(this.results).indexOf('error') !== -1" disabled>
                    Add
                  </v-btn>
                  <v-btn v-if="Object.keys(this.results).indexOf('error') === -1 && createflag!==2" dark color="#203864" @click="submitDefinition">
                    Add
                  </v-btn>
                  <v-btn v-if="createflag===2" dark color="#203864" @click="deleteDefinition">
                    delete
                  </v-btn>
                  <v-btn v-if="createflag===2" dark color="#203864" @click="updateDefinition">
                    Update
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-card flat outlined>
                <v-card-title style="height: 100%;">
                    Valid units
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="units"
                  :search="search"
                  :custom-filter="filterSearch"
                  dense
                ></v-data-table>
              </v-card>
            </v-col>
            <v-col md="6">
              <v-card flat outlined>
                <v-card-title style="height: 100%;">
                    Valid prefix
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="prefix_search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="prefix_headers"
                  :items="prefixs"
                  :search="prefix_search"
                  dense
                ></v-data-table>
              </v-card>
            </v-col>
          </v-row>

        </v-col>
        <v-col class="px-5" style="height: 100%;">
          <v-card>
            <v-toolbar flat dark height="50px" color="#203864">
              <v-toolbar-title>Definitions</v-toolbar-title>
            </v-toolbar>
            <v-card-text  style="height: calc(100vh - 110px);overflow-y:scroll;">
              <v-treeview
                open-all
                dense
                activatable
                hoverable
                @update:active="activeDifinition"
                :items="definitions"
              ></v-treeview>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </v-main>
</template>

<script>
import Navi from '~/components/molecules/Navi.vue'
import Cookies from 'universal-cookie'
import {mapGetters, mapActions } from 'vuex'

export default {
  layout: 'project',
  components: { Navi },
  async asyncData({ $axios,store,route,redirect }){
      $axios.setHeader('Authorization', "Bearer "+store.getters["access"])
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
        await store.dispatch('definition/fetchPhysics')
        await store.dispatch('definition/fetchDefinitions')

        var payload = {
          unit: "V"
        }
        await store.dispatch('definition/checkUnit',{payload})
      }
      return {project: project}
  },
  data() {
      return {
          search: '',
          headers: [
            { text: 'Symbol', value: 'symbol' },
            { text: 'Description', value: 'name' },
          ],
          units: [
          ],
          prefix_search: '',
          prefix_headers: [
            { text: 'Symbol', value: 'symbol' },
            { text: 'Name', value: 'name' },
            { text: 'Value', value: 'value' },
          ],
          prefixs: [
          ],
          propselect:"",
          unitselect:"",
          createflag:0,
          propertyid:null,
          unitid:null,
          error:[]
      }
  },
  created() {
    this.units = this.physics.units
    this.prefixs = this.physics.prefix
    if(this.project.id == ""){
      const cookies = new Cookies()
      cookies.remove('user')
      cookies.remove('access')
      cookies.remove('refresh')
      this.$store.commit('setUser', {token:null,user:null})
      this.$router.push('/login')
    }
  },
  computed: {
     loggedInUser () {
       return this.$store.state.user
     },
     ...mapGetters({physics:'definition/physics',emsg:'definition/emsg',results:'definition/results',definitions:'definition/definitions'})

  },
  methods: {
    filterSearch (value, search, item) {
      if(search.split('"').length==3){
        search = search.split('"')[1]
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value === search
      }
      else{
        return value != null &&
          search != null &&
          value.indexOf(search)>-1

      }
    },
    inputUnit(e){
      this.unitselect = e.target.value
      this.inputunit(this.unitselect)
    },
    async inputunit(val){
      if(this.createflag!=0){
        var payload = {
          unit: val
        }
        try{
          await this.checkUnit({payload})
          var parents = this.definitions.filter(def => def.name === this.propselect)[0]
          var si_unit = this.results.si_unit
          var payload = {
            unit: parents.children[0].name
          }
          await this.checkUnit({payload})
          if(si_unit!==this.results.si_unit)this.$store.commit('definition/changeResults', {"results":{error:"The dimension differs from the already registered unit"}})
        } catch (e) {
          this.error = this.emsg
        }
      }
    },
    async submitDefinition() {
      this.error = []
      try {
        if(Object.keys(this.results).indexOf('error') === -1){
          var payload = {
            unit: this.unitselect
          }
          try{
            await this.checkUnit({payload})
          } catch (e) {
            this.error = this.emsg
          }
          var payload = {
            property_name: this.propselect,
            symbol: this.unitselect,
            base: Boolean(this.results.si)
          }
          await this.publishDefinition({payload})
          await this.fetchDefinitions()
        }
      } catch (e) {
        this.error = this.emsg
        if(this.error.code == "token_not_valid"){
          const cookies = new Cookies()
          cookies.remove('user')
          cookies.remove('access')
          cookies.remove('refresh')
          this.$store.commit('setUser', {token:null,user:null})
          this.$router.push('/login')
        }
      }
    },
    async deleteDefinition() {
      this.error = []
      var payload = {
            unit_id: this.unitid,
            symbol: this.unitselect,
            property_id: this.propertyid,
            property_name: this.propselect
          }
      try{
        await this.removeUnit({payload})
      } catch (e) {
        this.error = this.emsg
      }
      var unitcnt = this.definitions.filter(def => def.name ===this.propselect)[0].children.length
      if(unitcnt<=1){
        try{
          await this.removeProperty({payload})
        } catch (e) {
          this.error = this.emsg
        }
      }

      await this.fetchDefinitions()
      if(Object.keys(this.error).indexOf('protect_error') === -1){
        this.propertyid = null
        this.unitid = null
        this.propselect = ""
        this.unitselect = ""
        this.inputunit("V")
        this.createflag = 0
      }
    },
    async updateDefinition() {
      this.error = []
      var payload = {
        property_id: this.propertyid,
        property_name: this.propselect
      }
      await this.editProperty({payload})

      if(this.unitselect!=""){
        var payload = {
          unit_id: this.unitid,
          symbol: this.unitselect
        }
        await this.editUnit({payload})
      }

      await this.fetchDefinitions()
    },
    activeDifinition(selection){
      this.error = []
      if(selection.length > 0){
        var parents = this.definitions.map(def => def.id)
        if(parents.indexOf(selection[0])<0){
          this.createflag = 2
          var parentidx = -1
          for(var pa of parents)if(selection[0] > pa)parentidx+=1
          this.propertyid = this.definitions[parentidx].pk
          this.propselect = this.definitions[parentidx].name
          this.unitid = this.definitions[parentidx].children.filter(ch => ch.id === selection[0])[0].pk
          this.unitselect = this.definitions[parentidx].children.filter(ch => ch.id === selection[0])[0].name
          this.inputunit(this.unitselect)
        }
        else{
          this.createflag = 1
          this.propertyid = this.definitions.filter(def => def.id === selection[0])[0].pk
          this.propselect =  this.definitions.filter(def => def.id === selection[0])[0].name
          this.unitid = null
          this.unitselect = ""
          //this.inputunit(this.unitselect)
        }
     }
      else{
        this.createflag = 0
        this.propertyid = null
        this.unitid = null
        this.propselect = ""
        this.unitselect = ""
        //this.inputunit("V")
      }
    },
    ...mapActions('definition', ['checkUnit','publishDefinition','fetchDefinitions','editProperty','editUnit','removeProperty','removeUnit'])

  },
}
</script>

<style>
</style>
