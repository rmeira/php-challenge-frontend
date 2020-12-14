import ProfileActivity from "~/models/ProfileActivity"

export const state = () => {
  return {
    profileActivities: [],
  }
}

export const actions = {
  async getProfileActivities({ commit }) {
    await commit("SET_PROFILE_ACTIVITIES", await ProfileActivity.get())
  },
}

export const mutations = {
  SET_PROFILE_ACTIVITIES(state, data) {
    state.profileActivities = data
  },
}

export const getters = {
  profileActivities: (state) => state.profileActivities,
}
