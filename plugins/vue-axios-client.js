export default function ({ $axios, $toast, app }) {
  $axios.onError((error) => {
    if (!window) return
    switch (error.response.status) {
      case 422:
        Object.keys(error.response.data.errors).map((key) => {
          $toast.error(error.response.data.errors[key][0])
        })
        break
      case 403:
        $toast.global.unauthorized()
        break
      case 401:
        $toast.global.unauthenticated()
        app.$auth.logout()
        break
      case 400:
        $toast.error(error.response.data)
        break
      case 500:
        $toast.global.serverError()
        break
    }
  })
}
