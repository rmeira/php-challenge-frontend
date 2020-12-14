<template>
  <v-main>
    <AppPageHeader
      icon="mdi-view-dashboard"
      title="Dashboard"
      :breadcrumbs="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Dashboard', to: '/dashboard', exact: true },
      ]"
    />
    <v-container grid-list-md fluid class="pt-0">
      <v-layout wrap row>
        <!-- <v-flex xs12 sm6 md4 child-flex d-flex>
          <AppWidgetStatus
            color="success"
            status="Usuários Ativos"
            :value="users.filter((user) => user.status !== 514).length"
            icon="mdi-account-group"
          />
        </v-flex>
        <v-flex xs12 sm6 md4 child-flex d-flex>
          <AppWidgetStatus
            color="yellow darken-2"
            status="Usuários inativos"
            :value="users.filter((user) => user.status === 514).length"
            icon="mdi-account-group"
          />
        </v-flex>
        <v-flex xs12 sm6 md4 child-flex d-flex>
          <AppWidgetStatus
            color="grey darken-2"
            status="Usuários total"
            :value="users.length"
            icon="mdi-account-group"
          />
        </v-flex> -->
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  computed: {
    ...mapGetters({
      users: "user/users",
    }),
  },
}
</script>
