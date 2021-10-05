<template>
<v-container fluid fill-height>
  <v-row justify="center" align-content="center" no-gutters>
    <v-col cols=12 sm=8 md=4 xl=3>
      <v-form>
        <v-card class="elevation-12">
          <v-toolbar dark color="#424242">
            <v-toolbar-title>Sign In</v-toolbar-title>
          </v-toolbar>
            <v-alert
              v-if="Object.keys(error).indexOf('detail') !== -1"
              :value="true"
              type="error"
            >{{error['detail']}}</v-alert>
          <v-card-text>
            <v-text-field
              prepend-icon="email"
              v-model="formData.email"
              label="email"
              :error-messages="Object.keys(error).indexOf('email') !== -1 ? [error['email']] : []"
              required
            />
            <v-text-field
              prepend-icon="lock"
              :append-icon="visible ? 'visibility' : 'visibility_off'"
              :type="visible ? 'text' : 'password'"
              :error-messages="Object.keys(error).indexOf('password') !== -1 ? [error['password']] : []"
              @click:append="visible = !visible"

              v-model="formData.password"
              label="password"
              required
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark @click="submit">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</v-container>
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
    return {
      formData: {
        email: '',
        password:''
      },
      visible: true,
      error: ""
    }
  },
  computed: {
    ...mapGetters(['user','access','refresh','emsg'])
  },
  methods: {
    async submit() {
      const cookies = new Cookies()
      try {
        await this.login({ ...this.formData })
        cookies.set('user', JSON.stringify(this.user), { path: '/' })
        cookies.set('access', JSON.stringify(this.access), { path: '/' })
        cookies.set('refresh', JSON.stringify(this.refresh), { path: '/' })
        this.$router.push('/projects')
      } catch (e) {
        this.error = this.emsg
      }
    },
    ...mapActions(['login'])
  }
}
</script>

<style>
</style>
