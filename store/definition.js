import moment from '~/plugins/moment'
import Cookies from 'universal-cookie'

export const state = () => ({
  physics: null,
  definitions:null,
  results:null,
  emsg:[]
})

export const getters = {
  physics: state => state.physics,
  definitions: state => state.definitions,
  results: state => state.results,
  emsg: state => state.emsg
}

export const mutations = {
  addPhysics(state, { physics }) {
    state.physics = physics
  },
  addResults(state, { results }) {
    state.results = results
  },
  addDefinition(state, { definitions }) {
    state.definitions = definitions
  },
  changeResults(state, { results }) {
    state.results = results
  },
  setError(state, {emsg}){
    state.emsg = emsg
  }
}

export const actions = {
  async publishDefinition({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const definitions = await this.$axios.$post("/v1/quantities/",{property_name:payload.property_name,symbol:payload.symbol,base:payload.base})
                          .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
                    
  },
  async fetchPhysics({ rootState, commit }) {
    if (!rootState.access) throw new Error('Invalid user')
    var  urls = "/v1/physics/"
    const physics = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!physics) throw new Error('Bad request')

    commit('addPhysics',{physics})
  },
  async fetchDefinitions({ rootState, commit }) {
    if (!rootState.access) throw new Error('Invalid user')
    var  urls = "/v1/quantities/"
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const definitions = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!definitions) throw new Error('Bad request')

    commit('addDefinition',{definitions})
  },
  async checkUnit({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    var  urls = "/v1/unit_check/?unit="+payload.unit
    const results = await this.$axios.$get(urls)

    commit('addResults',{results})
  },
  async editProperty({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const property = await this.$axios.$put("/v1/properties/"+payload.property_id,{property_name:payload.property_name})
                      .catch (error => {
                          commit('setError', { emsg:error.response.data })
                      });
    if (!property.id) throw new Error('Bad request')

  },
  async editUnit({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const unit = await this.$axios.$put("/v1/units/"+payload.unit_id,{symbol:payload.symbol})
                      .catch (error => {
                          commit('setError', { emsg:error.response.data })
                      });
    if (!unit.id) throw new Error('Bad request')
  },
  async removeProperty({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const results = await this.$axios.$delete("/v1/properties/"+payload.property_id,{property_name:payload.property_name})
                        .catch (error => {
                        commit('setError', { emsg:error.response.data})
                    });
  },
  async removeUnit({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const results = await this.$axios.$delete("/v1/units/"+payload.unit_id,{symbol:payload.symbol})
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });

  }
}