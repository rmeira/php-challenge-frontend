require("dotenv").config()
import webpack from "webpack"
import pt from "vuetify/es5/locale/pt"

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - PHP Challange",
    title: "PHP Challange",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  /**
   * Environments variables
   */
  env: {
    storage: process.env.APP_STORAGE,
    environment: process.env.APP_ENVIRONMENT,
    version: process.env.npm_package_version,
    api: process.env.APP_API,
    pusher: {
      key: process.env.APP_PUSHER_KEY,
      cluster: process.env.APP_PUSHER_CLUSTER,
    },
  },

  /**
   * Loading config component
   */
  loading: "~/components/AppLoading.vue",

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    "~/assets/css/main.css",
    "~/assets/css/editor.css",
    "~/assets/css/toasted.css",
    "~/assets/css/sweetalert.css",
    "~/assets/css/scrollbar.css",
    "~/assets/css/dropzone.css",
  ],

  /**
   * Auth options
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: `${process.env.APP_API}/v1/auth/login`,
            method: "post",
            propertyName: "token",
          },
          logout: {
            url: `${process.env.APP_API}/v1/auth/logout`,
            method: "post",
          },
          user: {
            url: `${process.env.APP_API}/v1/profile`,
            method: "get",
            propertyName: false,
          },
          tokenRequired: false,
          tokenType: false,
        },
      },
    },
    redirect: {
      login: "/login",
      logout: "/login",
      callback: "/login",
      home: "/",
      user: "/profile",
    },
    plugins: ["~/plugins/auth-redirect.js"],
  },

  /**
   * Laravel Echo options
   */
  echo: {
    broadcaster: "pusher",
    key: process.env.APP_PUSHER_KEY,
    cluster: process.env.APP_PUSHER_CLUSTER,
    encrypted: true,
    authEndpoint: `${process.env.APP_API}/broadcasting/auth`,
    authModule: true,
    connectOnLogin: true,
    disconnectOnLogout: true,
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/vue-api-query",
    { src: "~/plugins/vue-axios-client", ssr: false },
    { src: "~/plugins/vue-editor", ssr: false },
    { src: "~/plugins/vue-excel-export", ssr: false },
    { src: "~/plugins/vue-simple-alert", ssr: false },
    { src: "~/plugins/vue-apexcharts", ssr: false },
    { src: "~/plugins/vuetify-money", ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/dotenv",
    "@nuxtjs/auth",
    "@nuxtjs/laravel-echo",
    "@nuxtjs/toast",
  ],

  /**
   * Toast alert
   */
  toast: {
    position: "top-center",
    iconPack: "mdi",
    duration: 5000,
    action: {
      icon: "mdi-close",
      onClick: (e, toastObject) => {
        toastObject.goAway(0)
      },
    },
    register: [
      {
        name: "errorData",
        message:
          "Falha ao carregar o(s) registro(s), por favor tente novamente!",
        options: {
          type: "error",
        },
      },
      {
        name: "unauthorized",
        message: "Você não tem permissão para carregar os registros!",
        options: {
          type: "error",
        },
      },
      {
        name: "unauthenticated",
        message: "Sua sessão de acesso expirou, faça um novo login!",
        options: {
          type: "error",
        },
      },
      {
        name: "serverError",
        message: "Houve um erro no servidor, por favor contate o administrador",
        options: {
          type: "error",
        },
      },
      {
        name: "successStore",
        message: "Registro cadastrado com sucesso ;)",
        options: {
          type: "success",
        },
      },
      {
        name: "successUpdate",
        message: "Registro atualizado com sucesso ;)",
        options: {
          type: "success",
        },
      },
      {
        name: "successDelete",
        message: "Registro excluído com sucesso ;)",
        options: {
          type: "success",
        },
      },
      {
        name: "errorStore",
        message:
          "Ops, houve um erro ao cadastrar esse registro, tente novamente!",
        options: {
          type: "error",
        },
      },
      {
        name: "errorUpdate",
        message:
          "Ops, houve um erro ao atualizar esse registro, tente novamente!",
        options: {
          type: "error",
        },
      },
      {
        name: "errorDelete",
        message:
          "Ops, houve um erro ao excluir esse registro, tente novamente!",
        options: {
          type: "error",
        },
      },
      {
        name: "errorSearch",
        message: "Ops, não encontramos esse registro, tente novamente!",
        options: {
          type: "error",
        },
      },
    ],
  },

  /**
   * Route middleware
   */
  router: {
    middleware: ["auth"],
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    lang: {
      locales: { pt },
      current: "pt",
    },
    theme: {
      dark: false,
    },
  },

  /**
   * PWA configs
   */
  pwa: {
    manifest: {
      name: process.env.APP_TITLE,
      short_name: process.env.APP_TITLE,
      theme_color: "#1866b3",
      background_color: "#fafafa",
      orientation: "portrait",
      lang: "pt-BR",
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    plugins: [
      // new webpack.ProvidePlugin({
      //   _: "lodash",
      // }),
    ],
  },
}
