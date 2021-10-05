<template>
<v-app>
  <v-app-bar app style="background-color: #fff">
    <v-toolbar-title>
      <v-img
          style="width:180px;margin-top:10px;"
          src="/img/labmine_logo.png"
        ></v-img>
        </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
    <v-btn v-if="isAuthenticated" text to="/ai" nuxt><v-icon>mdi-brain</v-icon></v-btn>
      <v-btn v-if="isAuthenticated" text to="/projects" nuxt><v-icon>mdi-library-shelves</v-icon></v-btn>
      <v-btn v-if="isAuthenticated" text @click="logout" nuxt><v-icon medium>mdi-logout-variant</v-icon></v-btn>
      <v-btn v-if="!isAuthenticated" text to="/login" nuxt>Sign In</v-btn>
      <v-btn v-if="!isAuthenticated" text to="/signup" nuxt>Register</v-btn>
    </v-toolbar-items>
  </v-app-bar>
  <nuxt/>
</v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cookies from 'universal-cookie'

export default {
  computed: {
    isAuthenticated () {
      return this.$store.state.isLoggedIn
    },
  },
  methods: {
    logout () {
      const cookies = new Cookies()
      cookies.remove('user')
      cookies.remove('access')
      cookies.remove('refresh')
      this.$store.commit('setUser', {token:null,user:null})
      this.$router.push('/login')
    },
    ...mapActions(['login'])
  },
}
</script>

<style>
</style>
