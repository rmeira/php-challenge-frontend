<template>
  <v-main>
    <AppPageHeader
      icon="mdi-home"
      title="Home"
      :breadcrumbs="[{ text: 'Home', to: '/' }]"
    />
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <template v-for="(item, index) in menu">
          <v-flex
            xs12
            sm6
            md3
            :key="index"
            v-if="hasPermission(item.permission)"
          >
            <AppWidgetShortcut
              :icon="item.icon"
              color="primary"
              :name="item.name"
              :route="item.route"
            />
          </v-flex>
        </template>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex"
import { permissionMixin } from "~/mixins/permissionMixin"
export default {
  mixins: [permissionMixin],
  computed: {
    ...mapGetters({
      users: "user/users",
      menu: "app/menu",
    }),
  },
}
</script>
