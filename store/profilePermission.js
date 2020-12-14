import ProfilePermission from "~/models/ProfilePermission"

export const state = () => {
  return {
    profilePermissions: [],
  }
}

export const actions = {
  async getProfilePermissions({ commit }) {
    await commit("SET_PROFILE_PERMISSIONS", await ProfilePermission.get())
  },
  async setProfilePermissions({ commit }, data) {
    await commit("SET_PROFILE_PERMISSIONS", data)
  },
}

export const mutations = {
  SET_PROFILE_PERMISSIONS(state, data) {
    state.profilePermissions = data
  },
}

export const getters = {
  profilePermissions: (state) => state.profilePermissions,
}
