import Activity from "~/models/Activity"

export const state = () => {
  return {
    activities: [],
  }
}

export const actions = {
  async getActivities({ commit }) {
    await commit("SET_ACTIVITIES", await Activity.include("causer").get())
  },
  async setActivities({ commit }, data) {
    await commit("SET_ACTIVITIES", data)
  },
}

export const mutations = {
  SET_ACTIVITIES(state, data) {
    state.activities = data
  },
}

export const getters = {
  activities: (state) => state.activities,
}
