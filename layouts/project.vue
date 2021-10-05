<template>
<v-app>
    <!--
  <v-app-bar fluid app clipped-left fixed>
    <v-toolbar-title>LabMine</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
    <v-btn v-if="isAuthenticated" text to="/ai" nuxt><v-icon>mdi-brain</v-icon></v-btn>
      <v-btn v-if="isAuthenticated" text to="/projects" nuxt><v-icon>mdi-library-shelves</v-icon></v-btn>
      <v-btn v-if="isAuthenticated" text @click="logout" nuxt><v-icon>mdi-account</v-icon></v-btn>
      <v-btn v-if="!isAuthenticated" text to="/login" nuxt>ログイン</v-btn>
      <v-btn v-if="!isAuthenticated" text to="/signup" nuxt>アカウント作成</v-btn>
    </v-toolbar-items>
  </v-app-bar app>
  -->
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
      cookies.remove('user', { path: '/' })
      cookies.remove('access', { path: '/' })
      cookies.remove('refresh', { path: '/' })
      this.$store.commit('setUser', {token:null,user:null})
      this.$router.push('/login')
    },
    ...mapActions(['login'])
  },
}
</script>

<style>
</style>
