<template>
  <div>
    <AppPageHeader
      icon="mdi-text"
      title="Atividades"
      :breadcrumbs="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Perfil', to: '/profile', exact: true },
        { text: 'Atividades', to: '/profile/activities', exact: true },
      ]"
    />
    <v-container grid-list-lg fluid>
      <v-card>
        <v-toolbar
          dark
          color="grey darken-2"
          flat
          extension-height="70"
          height="80"
        >
          <v-toolbar-title> Minhas atividades </v-toolbar-title>
          <v-spacer />
          <template v-slot:extension>
            <v-text-field
              label="Pesquisar"
              solo-inverted
              filled
              flat
              clearable
              prepend-inner-icon="mdi-database-search"
              v-model="activitiesSearch"
            />
          </template>
        </v-toolbar>
        <v-card-text class="pa-0">
          <client-only>
            <v-data-table
              :headers="activitiesHeaders"
              :items="profileActivities"
              :expanded.sync="expanded"
              :single-expand="false"
              :search="activitiesSearch"
              item-key="id"
              show-expand
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="pa-0">
                  <v-simple-table
                    dense
                    v-if="JSON.parse(item.properties).attributes"
                    class="elevation-0 transparent"
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>Campos</th>
                          <th>Valor antigo</th>
                          <th>Novo valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(att, index) in Object.keys(
                            JSON.parse(item.properties).attributes
                          )"
                          :key="index"
                        >
                          <td>{{ att }}</td>
                          <td>
                            {{
                              JSON.parse(item.properties).old
                                ? JSON.parse(item.properties).old[att]
                                : null
                            }}
                          </td>
                          <td>
                            {{ JSON.parse(item.properties).attributes[att] }}
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </template>
              <template v-slot:[`item.causer.name`]="{ item }">
                <AppAvatar :user="$auth.user" :size="30" class="mr-2 mb-1" />
                {{ $auth.user.name }}
              </template>
              <template v-slot:[`item.subject_type`]="{ item }">
                <v-chip label v-if="item.subject_type">{{
                  handleReturnArraySubjectType(item.subject_type)[2]
                }}</v-chip>
              </template>
              <template v-slot:[`item.description`]="{ item }">
                <v-chip :color="actionTypeColor(item.description)">
                  {{ item.description }}
                </v-chip>
              </template>
              <template v-slot:[`item.created_at`]="{ item }">
                {{ dateDistance(item.created_at) }}
              </template>
              <template v-slot:[`item.updated_at`]="{ item }">
                {{ dateDistance(item.updated_at) }}
              </template>
            </v-data-table>
          </client-only>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { dateMixin } from "~/mixins/dateMixin"
import { storageMixin } from "../../../mixins/storageMixin"

export default {
  head() {
    return {
      title: "Atividades",
    }
  },
  data() {
    return {
      activitiesSearch: "",
      expanded: [],
      activitiesHeaders: [
        {
          text: "Responsável",
          value: "causer.name",
        },
        {
          text: "Tabela",
          value: "subject_type",
        },
        {
          text: "Tipo de ação",
          value: "description",
        },
        {
          text: "Criado há",
          value: "updated_at",
        },
        {
          text: "Atualizado há",
          value: "updated_at",
        },
        {
          text: "",
          value: "data-table-expand",
        },
      ],
    }
  },
  mixins: [storageMixin, dateMixin],
  async mounted() {
    await this.$nextTick(async () => {
      await this.$nuxt.$loading.start()
      await this.getProfileActivities()
      await this.$nuxt.$loading.finish()
    })
  },
  methods: {
    ...mapActions({
      getProfileActivities: "profileActivity/getProfileActivities",
    }),
    actionTypeColor(action) {
      return action === "deleted"
        ? "error"
        : action === "updated"
        ? "warning"
        : "success"
    },
    handleReturnArraySubjectType(subjectType) {
      return String.raw`${subjectType}`.split("\\").join(" ").split(" ")
    },
  },
  computed: {
    ...mapGetters({
      profileActivities: "profileActivity/profileActivities",
    }),
  },
}
</script>

<style></style>
