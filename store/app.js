export const state = () => {
  return {
    menu: [
      {
        icon: "mdi-home",
        name: "Home",
        route: "/",
        permission: "",
        exact: true,
      },
      {
        icon: "mdi-account-group",
        name: "Usuários",
        route: "/users",
        permission: "users-index",
        exact: true,
      },
      {
        icon: "mdi-shield-account",
        name: "Regras",
        route: "/roles",
        permission: "roles-index",
      },
      {
        icon: "mdi-shield-lock",
        name: "Permissões ",
        route: "/permissions",
        permission: "permissions-index",
      },
      {
        icon: "mdi-text",
        name: "Atividades ",
        route: "/activities",
        permission: "activities-index",
      },
    ],
  }
}

export const getters = {
  menu: (state) => state.menu,
}
