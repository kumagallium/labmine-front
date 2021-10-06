import moment from '~/plugins/moment'
import Cookies from 'universal-cookie'

export const state = () => ({
  experiments: null,
  count:0,
  selectedlist: [],
  next:null,
  previous:null,
  emsg:null
})

export const getters = {
    experiments: state => state.experiments,
    count: state => state.count,
    selectedlist: state => state.selectedlist,
    next: state => state.next,
    previous: state => state.previous,
    emsg: state => state.emsg
}

export const mutations = {
  addExperiment(state, { experiment }) {
    experiment.contents.created_at = moment(experiment.contents.created_at).format('YYYY/MM/DD HH:mm:ss')
    state.experiments.push(experiment)
  },
  setPagenation(state,{count,next,previous}) {
    state.count = count
    state.previous = previous
    state.next = next
  },
  clearExperiments(state) {
    state.experiments = []
  },
  setList(state, {selectedlist}){
    state.selectedlist = selectedlist
  },
  addList(state, {newexp}){
    state.selectedlist.push(newexp)
  },
  removeList(state, {idx}){
    state.selectedlist.splice(idx, 1)
  },
  setError(state, {emsg}){
    state.emsg = emsg
  }
}

export const actions = {
  async fetchExperiments({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/projects/"+payload.projectid+"/experiments/?page="+payload.page
    if (payload.itemsperpage != undefined)urls += "&itemsperpage="+payload.itemsperpage
    if (payload.keywords !="")urls += "&keywords="+payload.keywords
    if (payload.tags !="")urls += "&tags="+payload.tags
    if (payload.dates.length == 1)urls += "&startdate="+payload.dates[0]
    else if (payload.dates.length == 2)urls += "&startdate="+payload.dates[0] + "&enddate="+payload.dates[1]
    const experiments = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!experiments) throw new Error('Bad request')
    commit('clearExperiments')
    Object.entries(experiments.results || [])
    .reverse()
    .forEach(([id, contents]) =>
        commit('addExperiment', {
        experiment: {
            id,
            contents
        }
        })
    )
    commit('setPagenation', { count:experiments.count,next:experiments.next,previous:experiments.previous })
  }
}