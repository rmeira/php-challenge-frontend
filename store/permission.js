import Permission from "~/models/Permission"

export const state = () => {
  return {
    permissions: [],
  }
}

export const actions = {
  async getPermissions({ commit }) {
    await commit("SET_PERMISSIONS", await Permission.get())
  },
  async setPermissions({ commit }, data) {
    await commit("SET_PERMISSIONS", data)
  },
}

export const mutations = {
  SET_PERMISSIONS(state, data) {
    state.permissions = data
  },
}

export const getters = {
  permissions: (state) => state.permissions,
}
