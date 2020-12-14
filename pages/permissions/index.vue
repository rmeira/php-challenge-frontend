<template>
  <v-main>
    <AppPageHeader
      icon="mdi-shield-lock"
      title="Permissões"
      :breadcrumbs="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Permissões', to: '/permissions', exact: true },
      ]"
    />
    <v-container grid-list-md fluid>
      <v-card>
        <v-toolbar
          dark
          color="grey darken-2"
          flat
          extension-height="70"
          height="80"
        >
          <v-toolbar-title> Listagem de permisões </v-toolbar-title>
          <v-spacer />
          <v-btn
            text
            dark
            v-if="hasPermission('permissions-store')"
            @click="permissionFormDialog = !permissionFormDialog"
          >
            <v-icon left> mdi-plus </v-icon>
            Nova permissão
          </v-btn>
          <template v-slot:extension>
            <v-text-field
              label="Pesquisar"
              solo-inverted
              filled
              flat
              clearable
              prepend-inner-icon="mdi-database-search"
              v-model="search"
            />
          </template>
        </v-toolbar>
        <v-card-text class="pa-0">
          <client-only>
            <v-data-table
              :headers="permissionsHeaders"
              :items="permissions"
              :search="search"
            >
              <template v-slot:[`item.created_at`]="{ item }">
                {{ dateDistance(item.created_at) }}
              </template>
              <template v-slot:[`item.updated_at`]="{ item }">
                {{ dateDistance(item.updated_at) }}
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="grey darken-2"
                      icon
                      @click="handleEditPermission(item)"
                      v-on="on"
                      v-bind="attrs"
                      v-if="hasPermission('permissions-update')"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span> Atualizar permissão </span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="error"
                      icon
                      @click="handleDeletePermission(item)"
                      v-on="on"
                      v-bind="attrs"
                      v-if="hasPermission('permissions-delete')"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span> Deletar permissão </span>
                </v-tooltip>
              </template>
            </v-data-table>
          </client-only>
        </v-card-text>
      </v-card>
      <v-dialog max-width="600" v-model="permissionFormDialog" scrollable>
        <v-card flat>
          <v-toolbar dark color="grey darken-2" flat height="80">
            <v-toolbar-title>
              {{
                this.permissionForm.id
                  ? "Atualizar permissão"
                  : "Criar permissão"
              }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="permissionFormDialog = !permissionFormDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form
            lazy-validation
            v-model="permissionFormIsValid"
            ref="permissionFormRef"
            @submit.prevent="
              permissionForm.id
                ? handleUpdatePermission()
                : handleCreatePermission()
            "
          >
            <v-card-text>
              <v-text-field
                v-model="permissionForm.name"
                outlined
                label="Nome"
                :rules="rules.required"
              />
            </v-card-text>
            <v-card-actions class="pr-4 pb-4">
              <v-spacer />
              <v-btn type="submit" color="success">
                {{
                  this.permissionForm.id
                    ? "Atualizar permissão"
                    : "Criar permissão"
                }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { mask } from "vue-the-mask"

import { permissionMixin } from "~/mixins/permissionMixin"
import { validateMixin } from "~/mixins/validateMixin"
import { storageMixin } from "~/mixins/storageMixin"
import { dateMixin } from "~/mixins/dateMixin"

import Permission from "~/models/Permission"

export default {
  data() {
    return {
      search: "",
      permissionsHeaders: [
        { text: "Nome", value: "name" },
        {
          text: "Criado há",
          value: "updated_at",
        },
        {
          text: "Atualizado há",
          value: "updated_at",
        },
        {
          text: "Ações",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      permissionFormDialog: false,
      permissionFormIsValid: false,
      permissionForm: {
        name: "",
      },
    }
  },
  mixins: [validateMixin, storageMixin, dateMixin, permissionMixin],
  directives: { mask },
  async mounted() {
    await this.$nextTick(async () => {
      await this.$nuxt.$loading.start()
      await this.getPermissions()
      await this.$nuxt.$loading.finish()
    })
  },
  methods: {
    ...mapActions({
      getPermissions: "permission/getPermissions",
    }),
    async handleCreatePermission() {
      if (this.$refs.permissionFormRef.validate()) {
        await this.$nuxt.$loading.start()
        let permission = new Permission(this.permissionForm)
        await permission.save()
        await this.getPermissions()
        this.permissionFormDialog = !this.permissionFormDialog
        await this.$nuxt.$loading.finish()
      }
    },
    async handleUpdatePermission() {
      if (this.$refs.permissionFormRef.validate()) {
        await this.$nuxt.$loading.start()
        await this.permissionForm.save()
        this.permissionFormDialog = !this.permissionFormDialog
        await this.$nuxt.$loading.finish()
      }
    },
    async handleEditPermission(permission) {
      this.permissionForm = permission
      this.permissionFormDialog = !this.permissionFormDialog
    },
    async handleDeletePermission(permission) {
      await this.$confirm(
        "Deseja continuar?",
        `Você está excluindo a permissão: ${permission.name}`,
        "question"
      )
        .then(async () => {
          await this.$nuxt.$loading.start()
          await permission.delete()
          await this.getPermissions()
          await this.$toast.success("Excluido com sucesso! ;)")
          await this.$nuxt.$loading.finish()
        })
        .catch((error) => {})
    },
    async handleClearForm() {
      this.$refs.permissionFormRef.resetValidation()
      this.permissionForm = {
        name: "",
      }
    },
  },
  computed: {
    ...mapGetters({
      permissions: "permission/permissions",
    }),
  },
  watch: {
    permissionFormDialog: function () {
      if (!this.permissionFormDialog) this.handleClearForm()
    },
  },
}
</script>
