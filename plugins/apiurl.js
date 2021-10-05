export default (context) => {
    context.app.$axios.defaults.baseURL = context.app.$env.BASE_URL + '/api'
}