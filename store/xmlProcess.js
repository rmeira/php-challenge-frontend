import XmlProcess from "~/models/XmlProcess"

export const state = () => {
  return {
    xmlProcess: [],
  }
}

export const actions = {
  async getXmlProcesss({ commit }) {
    await commit("SET_XML_PROCESS", await XmlProcess.get())
  },
  async setXmlProcesss({ commit }, data) {
    await commit("SET_XML_PROCESS", data)
  },
}

export const mutations = {
  SET_XML_PROCESS(state, data) {
    state.xmlProcess = data
  },
}

export const getters = {
  xmlProcess: (state) => state.xmlProcess,
}
