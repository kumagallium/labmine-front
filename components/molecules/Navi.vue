<template>
  <v-navigation-drawer
    expand-on-hover
    clipped
    permanent
    app
    color="#203864"
    dark
    mini-variant-width="60"
  >
    <v-list dense>
      <v-list-item link two-line >
        <v-list-item-avatar>
          <v-avatar color="white" size="40">
            <span style="color:#203864;">{{project.project_name.toUpperCase().substr(0,2)}}</span>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{project.project_name}}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>mdi-menu-down</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense flat>
      <v-list-item-group color="amber">
        <v-list-item :to="'/projects/'+project.id+'/dashboard/'">
          <v-list-item-icon>
            <v-icon medium>mdi-view-dashboard-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item :to="'/projects/'+project.id+'/search/'">
          <v-list-item-icon>
            <v-icon medium>mdi-magnify</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Search</v-list-item-title>
        </v-list-item>

        <v-list-item :to="'/projects/'+project.id+'/notebook/'">
          <v-list-item-icon>
            <v-icon medium>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Create Experiment</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-divider></v-divider>

    <v-list dense flat>
      <v-list-item-group color="amber">
        <v-list-item :to="'/projects/'+project.id+'/design/'">
          <v-list-item-icon>
            <v-icon medium>mdi-graph-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Create Workflow</v-list-item-title>
        </v-list-item>
        <v-list-item :to="'/projects/'+project.id+'/definition/'">
          <v-list-item-icon>
            <v-icon medium>mdi-file-tree</v-icon>
          </v-list-item-icon>
          <v-list-item-title>definitions</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>


    <v-list dense flat style="position:absolute;bottom:0;width:100%;">
      <v-list-item-group>
        <v-list-item to="/ai" color="white">
          <v-list-item-icon>
            <v-icon medium>mdi-brain</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Analysis</v-list-item-title>
        </v-list-item>
        <v-list-item to="/projects" color="white">
          <v-list-item-icon>
            <v-icon medium >mdi-library-shelves</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Library</v-list-item-title>
        </v-list-item>
        <v-list-item  @click="logout" color="white">
          <v-list-item-icon>
            <v-icon medium>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cookies from 'universal-cookie'

export default {
  props: ['project'],
  computed: {
     loggedInUser () {
       return this.$store.state.user
     },
  },
  methods: {
    logout () {
      const cookies = new Cookies()
      cookies.remove('user', { path: '/' })
      cookies.remove('access', { path: '/' })
      cookies.remove('refresh', { path: '/' })
      this.$store.commit('setUser', {token:null,user:null})
      this.$router.push('/login')
    }
  },
  ...mapActions(['login'])
}
</script>
