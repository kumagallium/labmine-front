<template>
<v-container fluid fill-height>
<v-layout>
  <v-row justify="center" align-content="center" no-gutters>
    <v-col cols=12 sm=8 md=4 xl=3>
      <v-form>
        <v-card class="elevation-12">
          <v-toolbar dark color="#424242">
            <v-toolbar-title>Register</v-toolbar-title>
          </v-toolbar>
            <v-alert
              v-if="Object.keys(error).indexOf('non_field_errors') !== -1"
              :value="true"
              type="error"
            >{{error['non_field_errors'][0]}}</v-alert>
          <v-card-text>
            <v-text-field
              prepend-icon="person"
              v-model="formData.username"
              label="Username"
              :error-messages="Object.keys(error).indexOf('username') !== -1 ? [error['username'][0]] : []"
              required
            />
              <v-text-field
                prepend-icon="email"
                v-model="formData.email"
                label="Email"
                :error-messages="Object.keys(error).indexOf('email') !== -1 ? [error['email'][0]] : []"
                required
              />
            <v-text-field
              prepend-icon="lock"
              :append-icon="visible1 ? 'visibility' : 'visibility_off'"
              :type="visible1 ? 'text' : 'password'"
              name="input-10-2"
              label="Password"
              hint="At least 8 characters"
              :error-messages="Object.keys(error).indexOf('password') !== -1 ? [error['password'][0]] : []"
              v-model="formData.password"
              @click:append="visible1 = !visible1"
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              :append-icon="visible2 ? 'visibility' : 'visibility_off'"
              :type="visible2 ? 'text' : 'password'"
              @click:append="visible2 = !visible2"
              :error-messages="Object.keys(error).indexOf('confirm_password') !== -1 ? [error['confirm_password'][0]] : []"
              v-model="formData.confirm_password"
                label="Confirm password"
              required
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark @click="submit">Create Account</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</v-layout>
</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cookies from 'universal-cookie'

export default {
  layout: 'top',
  asyncData({ redirect, store }) {
    if (store.getters['access']) {
      redirect('/projects')
    }
    return {
      formData: {
        username:'',
        email: '',
        password:'',
        confirm_password:''
      },
      visible1: false,
      visible2: false,
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
        await this.register({ ...this.formData })
        cookies.set('user', JSON.stringify(this.user))
        cookies.set('access', JSON.stringify(this.access))
        cookies.set('refresh', JSON.stringify(this.refresh))
        this.$router.push('/projects')
      } catch (e) {
        this.error = this.emsg
      }
    },
    ...mapActions(['register'])
  }
}
</script>

<style>
</style>
