import Role from "~/models/Role"

export const state = () => {
  return {
    roles: [],
  }
}

export const actions = {
  async getRoles({ commit }) {
    await commit("SET_ROLES", await Role.get())
  },
  async setRoles({ commit }, data) {
    await commit("SET_ROLES", data)
  },
}

export const mutations = {
  SET_ROLES(state, data) {
    state.roles = data
  },
}

export const getters = {
  roles: (state) => state.roles,
}
