<template>
  <v-main wrap>
    <Navi :project="project"></Navi>
    <v-container style="height: 100%;" fluid>
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
import Navi from '~/components/molecules/Navi.vue'
import {mapGetters, mapActions } from 'vuex'
import Cookies from 'universal-cookie'

export default {
  components: {
    Navi
  },
  layout: 'project',
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
          title: 'Hello Vue!!'
      }
  },
  computed: {
     loggedInUser () {
       return this.$store.state.user
     },
  }
}
</script>

<style>
</style>
