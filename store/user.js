import User from "~/models/User"

export const state = () => {
  return {
    users: [],
    user: {},
  }
}

export const actions = {
  async getUsers({ commit }) {
    await commit("SET_USERS", await User.get())
  },
  async setUsers({ commit }, data) {
    await commit("SET_USERS", data)
  },
  async setUser({ commit }, data) {
    await commit("SET_USER", data)
  },
}

export const mutations = {
  SET_USERS(state, data) {
    state.users = data
  },
  SET_USER(state, data) {
    state.user = data
  },
}

export const getters = {
  users: (state) => state.users,
  user: (state) => state.user,
  authorizedUsers: (state) => state.users.filter((user) => !!user.authorized),
}
