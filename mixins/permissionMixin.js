import { mapGetters } from "vuex"

export const permissionMixin = {
  methods: {
    hasPermission(permission = null) {
      if (!permission) return true
      return !!this.profilePermissions.find((item) => item.name === permission)
    },
    hasRole(role = null) {
      if (!role) return true
      return !!this.profileRoles.find((item) => item.name === role)
    },
  },
  computed: {
    ...mapGetters({
      profileRoles: "profileRole/profileRoles",
      profilePermissions: "profilePermission/profilePermissions",
    }),
  },
}
