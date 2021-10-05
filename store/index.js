import moment from '~/plugins/moment'

export const state = () => ({
  isLoggedIn: false,
  access: null,
  refresh: null,
  user:null,
  emsg:null
})

export const getters = {
  isLoggedIn: state => state.isLoggedIn,
  access: state => state.access,
  refresh: state => state.refresh,
  user: state => state.user,
  emsg: state => state.emsg
}

export const mutations = {
  setUser(state, { token,user }) {
    /*if (user.id.match(/_|@|\./)) {
      throw new TypeError('invalid username')
    }*/
    if(token&&user){
      state.access = token.access
      state.refresh = token.refresh
      state.user = user
      state.isLoggedIn = true
    }
    else{
      state.access = null
      state.refresh = null
      state.user = null
      state.isLoggedIn = false
    }
  },
  setError(state, {emsg}){
    state.emsg = emsg
  }
}

export const actions = {
  async login({ commit }, {email, password}) {
    var token = await this.$axios.$post("/token/",{email:email,password:password})
                  .catch (error => {
                      commit('setError', { emsg:error.response.data })
                   });
    if (!token) throw new Error('Invalid user')

    this.$axios.setHeader('Authorization', "Bearer "+token.access)
    var user = await this.$axios.$get("/user/mypage/")

    commit('setUser', { token, user })
  },
  async register({ commit }, {username, email, password,confirm_password}) {
    var user = await this.$axios.$post("/user/register/",{username:username, email:email,password:password, confirm_password:confirm_password})
                  .catch (error => {
                      commit('setError', { emsg:error.response.data })
                   });
    if (!user.id) throw new Error('Invalid user')

    var token = await this.$axios.$post("/token/",{email:email,password:password})
    if (!token.access) throw new Error('Invalid user')

    commit('setUser', { token, user })
  }
}
