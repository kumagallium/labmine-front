import Cookies from 'universal-cookie'

export default ({req, route, store,redirect,$axios }) => {
  if (process.browser) {
    return
  }
  const cookies = new Cookies(req.headers.cookie)
  const user = cookies.get('user')
  const access = cookies.get('access')
  const refresh = cookies.get('refresh')
  const token = {access:access,refresh:refresh}

  if (user && token){
    store.commit('setUser', { token, user })
  }
  else{
    return redirect('/login')
  }
}
