<template>
<v-app>
    <!--
  <v-app-bar app>
    <v-toolbar-title>LabMine</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn v-if="isAuthenticated" text to="/profile" nuxt>プロフィール</v-btn>
      <v-btn v-if="isAuthenticated" text @click="logout" nuxt>ログアウト</v-btn>
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
