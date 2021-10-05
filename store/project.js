import moment from '~/plugins/moment'
import Cookies from 'universal-cookie'

export const state = () => ({
  projects: null,
  emsg:null
})

export const getters = {
    projects: state => state.projects,
    emsg: state => state.emsg
}

export const mutations = {
  addProject(state, { project }) {
    project.contents.fields.created_at = moment(project.contents.fields.created_at).format('YYYY/MM/DD HH:mm:ss')
    state.projects.push(project)
  },
  clearProjects(state) {
    state.projects = []
  },
  setError(state, {emsg}){
    state.emsg = emsg
  }
}

export const actions = {
  async publishProject({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const newProject = await this.$axios.$post("/v1/projects/",{project_name:payload.projectname})
                          .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
    if (!newProject.id) throw new Error('Bad request')
    const projects = await this.$axios.$get("/v1/projects/")
    commit('clearProjects')
    Object.entries(projects || [])
      .reverse()
      .forEach(([id, contents]) =>
        commit('addProject', {
          project: {
            id,
            contents
          }
        })
      )
  },
  async fetchProject({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const project = await this.$axios.$get(`/v1/projects/${payload.projectid}`)
    commit('addProject', { project: { id,contents } })
  },
  async fetchProjects({ rootState, commit }) {
      if (!rootState.access) throw new Error('Invalid user')
      this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
      const projects = await this.$axios.$get("/v1/projects/")
                          .catch (error => {
                            console.log(error)
                            commit('setError', { emsg:error.response.data })
                        });
      if (!projects) throw new Error('Bad request')
      commit('clearProjects')
      Object.entries(projects || [])
        .reverse()
        .forEach(([id, contents]) =>
          commit('addProject', {
            project: {
              id,
              contents
            }
          })
        )
  },
  async editProject({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const newProject = await this.$axios.$put(`/v1/projects/${payload.projectid}`,{project_name:payload.projectname})
                      .catch (error => {
                          commit('setError', { emsg:error.response.data })
                      });
    if (!newProject.id) throw new Error('Bad request')
    const projects = await this.$axios.$get("/v1/projects/")
    commit('clearProjects')
    Object.entries(projects || [])
      .reverse()
      .forEach(([id, contents]) =>
        commit('addProject', {
          project: {
            id,
            contents
          }
        })
      )
  },
  async removeProject({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const newPost = await this.$axios.$delete(`/v1/projects/${payload.projectid}`)
    const projects = await this.$axios.$get("/v1/projects/")
    commit('clearProjects')
    Object.entries(projects || [])
      .reverse()
      .forEach(([id, contents]) =>
        commit('addProject', {
          project: {
            id,
            contents
          }
        })
      )
  }
}