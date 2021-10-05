<template>
  <v-main wrap>
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cookies from 'universal-cookie'

export default {
  layout: 'top',
  async asyncData({ redirect, store }) {
    try {
      await store.dispatch('project/fetchProjects')
    } catch (err) {
      const cookies = new Cookies()
      cookies.remove('user', { path: '/' })
      cookies.remove('access', { path: '/' })
      cookies.remove('refresh', { path: '/' })
      store.commit('setUser', {token:null,user:null})
    }

    if (store.state.isLoggedIn) {
      redirect('/projects/')
    }
  },
  computed: {
    ...mapGetters(['user','access','refresh','emsg'])
  },
}


</script>
