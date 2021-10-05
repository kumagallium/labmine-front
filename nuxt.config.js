import colors from 'vuetify/es5/util/colors'
import webpack from 'webpack'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
    ],
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js',type: "text/javascript" },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-browser/0.1.0/jquery.browser.js',type: "text/javascript" },
        { src: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',type: "text/javascript" },
        { src: '/js/draw2d.js',type: "text/javascript" },
        { src: '/js/BaseCanvas.js',type: "text/javascript" },
        { src: '/js/MyInputPortLocator.js',type: "text/javascript" },
        { src: '/js/MyOutputPortLocator.js',type: "text/javascript" },
        { src: '/js/CustomFigure.js',type: "text/javascript" },
        { src: '/js/ToolFigure.js',type: "text/javascript" },
        { src: '/js/MaterialFigure.js',type: "text/javascript" },
        { src: '/js/PlanFigure.js',type: "text/javascript" }
      ]
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/style.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/apiurl.js'}
  /*  { src: '~/node_modules/jquery',
      mode: "client" },
    { src: '~/node_modules/draw2d',
      mode: "client" },*/
  ],
  router: {
    middleware: [
      'auth-cookie'
    ]
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    //'@nuxtjs/axios',
    //'@nuxtjs/auth',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    ['nuxt-env', { keys: [{ key: 'BASE_URL', default: 'http://localhost:8001' }] }]
    //'@nuxtjs/auth',
    //'@nuxtjs/vuetify',
    //'cookieparser',
    //'js-cookie',
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  axios: {
  },
  /*auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'token/', method: 'post', propertyName: 'access' },
          user: { url: 'user/mypage/', method: 'get',propertyName: ''},
          logout: false
        }
      }
    }
  },*/
  vuetify: {
    theme: {
      primary: '#203864',
      secondary: '#203864',
      accent: '#ffeb3b',
      error: '#f44336',
      warning: '#ffc107',
      info: '#3F51B5',
      success: '#8bc34a'
    }
  },
  /*
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },*/
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    /*
    vendor: ["jquery","draw2d"],
    plugins: [
          new webpack.ProvidePlugin({
            '$': 'jquery',
            'jquery': 'jquery',
            'window.jQuery': 'jquery',
            'jQuery': 'jquery',
              'draw2d':'draw2d'
          })
        ],*/
    extend (config, ctx) {
      const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
      config.plugins.push(new HardSourceWebpackPlugin())
    }
  }
}
