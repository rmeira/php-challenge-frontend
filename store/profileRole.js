import ProfileRole from "~/models/ProfileRole"

export const state = () => {
  return {
    profileRoles: [],
  }
}

export const actions = {
  async getProfileRoles({ commit }) {
    await commit("SET_PROFILE_ROLES", await ProfileRole.get())
  },
  async setProfileRoles({ commit }, data) {
    await commit("SET_PROFILE_ROLES", data)
  },
}

export const mutations = {
  SET_PROFILE_ROLES(state, data) {
    state.profileRoles = data
  },
}

export const getters = {
  profileRoles: (state) => state.profileRoles,
}
