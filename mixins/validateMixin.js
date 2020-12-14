export const validateMixin = {
  data() {
    return {
      rules: {
        required: [(v) => !!v || "O campo é obrigatório"],
        min8: [
          (v) => !!v || "O campo é obrigatório",
          (v) =>
            (v && v.length >= 8) || "O campo deve ter mais que 8 caracteres",
        ],
        noReqMin8: [
          (v) =>
            (v && v.length >= 8) || "O campo deve ter mais que 8 caracteres",
        ],
        min32: [
          (v) => !!v || "O campo é obrigatório",
          (v) =>
            (v && v.length >= 32) || "O campo deve ter mais que 32 caracteres",
        ],
        email: [
          (v) => !!v || "O campo é obrigatório",
          (v) => /.+@.+\..+/.test(v) || "E-mail incorreto",
        ],
      },
    }
  },
}
