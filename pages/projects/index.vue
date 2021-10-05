<template>
  <v-main wrap>
    <v-container style="height: 100%;" fluid>
      <v-row>
        <v-col class="px-5">
          <v-card color="white" flat>
            <v-card-title>YOUR PROJECTS　
              <v-btn id="pluse" small fab dark color="indigo" @click="overlay = !overlay;editflag=0;projectname='';projectid=''">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-dialog
              v-model="overlay"
              max-width="290"
            >
              <v-card dark color="white">
                <ProjectEdit v-on:submitProject="applyProject" :target="'Project'" :editflag="editflag" :title="projectname" :editor="loggedInUser" :error="error">
                </ProjectEdit>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    text
                    @click="overlay = false;error=''">Cancel
                  </v-btn>

                  <v-btn
                    color="primary"
                    text
                    @click="publish"
                    v-bind:disabled="projectname==''"
                  >
                    Save
                  </v-btn>
                </v-card-actions>

              </v-card>
            </v-dialog>
            <v-card-text>
              <v-row>
                <v-slide-group show-arrows style="width:100%;">
                  <v-slide-item
                    v-for="project of projects"
                    :key="project.contents.pk">
                    <v-col cols="12" md="2">
                      <BookCover :id="project.contents.pk" :title="project.contents.fields.project_name" :editor="project.contents.fields.editor" :startdate="project.contents.fields.created_at" v-on:getFlag="changeFlag" v-on:deleteFlag="deletefunc"></BookCover>
                    </v-col>
                  </v-slide-item>
                </v-slide-group>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="px-10">
        <v-col
          cols="12"
          md="4"
        >
          <v-skeleton-loader
            class="mb-6"
            type="card-avatar, article, actions"
          ></v-skeleton-loader>

          <v-skeleton-loader type="date-picker"></v-skeleton-loader>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-skeleton-loader
            class="mb-6"
            type="article, actions"
          ></v-skeleton-loader>

          <v-skeleton-loader
            class="mb-6"
            type="table-heading, list-item-two-line, image, table-tfoot"
          ></v-skeleton-loader>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-skeleton-loader
            class="mb-6"
            type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
          ></v-skeleton-loader>

          <v-skeleton-loader type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
        </v-col>
      </v-row>

    </v-container>
  </v-main>
</template>

<script>
import BookCover from '~/components/molecules/BookCover.vue'
import ProjectEdit from '~/components/molecules/ProjectEdit.vue'
import {mapGetters, mapActions } from 'vuex'
import Cookies from 'universal-cookie'

export default {
  layout: 'top',
  components: {
    BookCover,
    ProjectEdit
  },
  async asyncData({ store, redirect }){
    try {
      await store.dispatch('project/fetchProjects')
    } catch (err) {
      console.log(err)
    }
  },
  data() {
      return {
        title: 'Hello Vue!!',
        overlay: false,
        absolute: false,
        opacity:0.4,
        zIndex: 5,
        projectname:"",
        projectid:"",
        editflag:0,
        error:""
      }
  },
  created() {
    if(!this.projects){
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
    ...mapGetters({projects:'project/projects',emsg:'project/emsg'})
  },
  methods: {
    applyProject:function(projectname_tmp){
      this.projectname = projectname_tmp
    },
    changeFlag:function(val){
      this.editflag = val.editflag
      this.projectname = val.projectname
      this.projectid = val.projectid
      this.overlay = true
    },
    async deletefunc(val) {
      const payload = {
        projectid: Number(val.projectid)
      }
      await this.removeProject({payload})
    },
    async publish() {
      try {
        if(this.editflag==0){
          const payload = {
            projectname: this.projectname
          }
          await this.publishProject({payload})
        }
        else{
          const payload = {
            projectid: Number(this.projectid),
            projectname: this.projectname
          }
          await this.editProject({payload})
        }
        this.overlay = false
        this.error = ""
      } catch (e) {
        this.error = this.emsg
      }
    },
    ...mapActions('project', ['publishProject','editProject','removeProject'])
  }
}
</script>

<style>
</style>
