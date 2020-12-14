<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="openSideBar"
      :mini-variant.sync="miniSidebar"
      app
    >
      <v-toolbar class="ml-0" fixed height="64">
        <v-toolbar-title
          v-if="!miniSidebar"
          class="subtitle-1 font-weight-medium ml-3"
        >
          PHP CHALLANGE
        </v-toolbar-title>
      </v-toolbar>

      <v-list-item two-line :class="miniSidebar && 'px-2'">
        <v-list-item-avatar class="ml-0">
          <v-img
            :src="$auth.user.avatar ? storageFile($auth.user.avatar) : avatar"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ $auth.user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ $auth.user.email }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            icon
            @click.stop="miniSidebar = !miniSidebar"
            class="hidden-sm-and-down"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider />
      <v-list dense>
        <template v-for="(item, index) in menu">
          <v-list-item
            :key="index"
            :exact="item.exact"
            nuxt
            :to="item.route"
            link
            v-if="hasPermission(item.permission)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app color="white" height="64">
      <v-app-bar-nav-icon
        @click="openSideBar = !openSideBar"
      ></v-app-bar-nav-icon>
      <v-spacer />
      <AppNavbarProfile />
    </v-app-bar>
    <nuxt-child />
    <AppFooter />
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { permissionMixin } from "~/mixins/permissionMixin"
import { storageMixin } from "~/mixins/storageMixin"

import avatar from "~/assets/images/avatar.png"

import ProfileRole from "~/models/ProfileRole"
import ProfilePermission from "~/models/ProfilePermission"

export default {
  data() {
    return {
      avatar,
      openSideBar: true,
      miniSidebar: false,
    }
  },
  mixins: [storageMixin, permissionMixin],
  async beforeMount() {
    await this.$nextTick(async () => {
      try {
        await this.setProfilePermissions(await ProfilePermission.get())
        await this.setProfileRoles(await ProfileRole.get())
      } catch (error) {
        await this.$toast.global.errorData()
      }
    })
  },
  methods: {
    ...mapActions({
      setProfileRoles: "profileRole/setProfileRoles",
      setProfilePermissions: "profilePermission/setProfilePermissions",
    }),
  },
  computed: {
    ...mapGetters({
      menu: "app/menu",
    }),
  },
}
</script>
