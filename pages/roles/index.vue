<template>
  <v-main>
    <AppPageHeader
      icon="mdi-shield-account"
      title="Regras"
      :breadcrumbs="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Regras', to: '/roles', exact: true },
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
          <v-toolbar-title> Listagem de regras </v-toolbar-title>
          <v-spacer />
          <v-btn text dark @click="roleFormDialog = !roleFormDialog">
            <v-icon left> mdi-plus </v-icon>
            Nova regra
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
              :headers="rolesHeaders"
              :items="roles"
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
                      @click="handleEditRole(item)"
                      v-on="on"
                      v-bind="attrs"
                      v-if="hasPermission('roles-update')"
                      :disabled="item.name === 'Admin'"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span> Atualizar regra </span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="info"
                      icon
                      @click="handleEditRolePermission(item)"
                      v-on="on"
                      v-bind="attrs"
                      v-if="hasPermission('roles-update')"
                      :disabled="item.name === 'Admin'"
                    >
                      <v-icon>mdi-lock-check</v-icon>
                    </v-btn>
                  </template>
                  <span> Atualizar permisões da regra </span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="error"
                      icon
                      @click="handleDeleteRole(item)"
                      v-on="on"
                      v-bind="attrs"
                      v-if="hasPermission('roles-delete')"
                      :disabled="item.name === 'Admin'"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span> Deletar regra </span>
                </v-tooltip>
              </template>
            </v-data-table>
          </client-only>
        </v-card-text>
      </v-card>
      <v-dialog max-width="600" v-model="roleFormDialog" scrollable>
        <v-card flat>
          <v-toolbar dark color="grey darken-2" flat height="80">
            <v-toolbar-title>
              {{ this.roleForm.id ? "Atualizar regra" : "Criar nova regra" }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="roleFormDialog = !roleFormDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form
            lazy-validation
            v-model="roleFormIsValid"
            ref="roleFormRef"
            @submit.prevent="
              roleForm.id ? handleUpdateRole() : handleCreateRole()
            "
          >
            <v-card-text>
              <v-text-field
                v-model="roleForm.name"
                outlined
                label="Nome"
                :rules="rules.required"
              />
            </v-card-text>
            <v-card-actions class="pr-4 pb-4">
              <v-spacer></v-spacer>
              <v-btn type="submit" color="success">
                {{ this.roleForm.id ? "Atualizar regra" : "Criar regra" }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog max-width="800" v-model="rolePermissionsDialog" scrollable>
        <v-card flat>
          <v-toolbar
            dark
            color="grey darken-2"
            flat
            extension-height="70"
            height="80"
          >
            <v-toolbar-title>
              Atualizar permissão da regra: {{ role.name }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="rolePermissionsDialog = !rolePermissionsDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <template v-slot:extension>
              <v-text-field
                label="Pesquisar"
                solo-inverted
                filled
                flat
                clearable
                prepend-inner-icon="mdi-database-search"
                v-model="permissionsSearch"
              />
            </template>
          </v-toolbar>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="permissionsHeaders"
              :items="permissions"
              :search="permissionsSearch"
            >
              <template v-slot:[`item.created_at`]="{ item }">
                {{ dateDistance(item.created_at) }}
              </template>
              <template v-slot:[`item.updated_at`]="{ item }">
                {{ dateDistance(item.updated_at) }}
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon
                  @click="
                    handleFindPermission(item)
                      ? handleRemovePermission(item)
                      : handleAssignPermission(item)
                  "
                >
                  <v-icon color="success" v-if="handleFindPermission(item)">
                    mdi-toggle-switch
                  </v-icon>
                  <v-icon color="grey darken-2" v-else>
                    mdi-toggle-switch-off
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
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

import Role from "~/models/Role"

export default {
  data() {
    return {
      search: "",
      rolesHeaders: [
        { text: "Nome", value: "name" },
        {
          text: "Criado há",
          value: "created_at",
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
      roleFormDialog: false,
      roleFormIsValid: false,
      roleForm: {
        name: "",
        guard_name: "api",
      },
      rolePermissionsDialog: false,
      permissionsHeaders: [
        { text: "Nome", value: "name" },
        {
          text: "Ações",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      permissionsSearch: "",
      role: {},
    }
  },
  mixins: [validateMixin, storageMixin, dateMixin, permissionMixin],
  directives: { mask },
  async mounted() {
    await this.$nextTick(async () => {
      try {
        await this.$nuxt.$loading.start()
        await this.getRoles()
        await this.getPermissions()
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$nuxt.$loading.finish()
      }
    })
  },
  methods: {
    ...mapActions({
      getPermissions: "permission/getPermissions",
      getRoles: "role/getRoles",
    }),
    async handleCreateRole() {
      if (this.$refs.roleFormRef.validate()) {
        try {
          await this.$nuxt.$loading.start()
          let role = new Role(this.roleForm)
          await role.save()
          await this.getRoles()
          this.roleFormDialog = !this.roleFormDialog
          await this.$nuxt.$loading.finish()
        } catch (error) {
          await this.$nuxt.$loading.finish()
        }
      }
    },
    async handleUpdateRole() {
      if (this.$refs.roleFormRef.validate()) {
        await this.$nuxt.$loading.start()
        await this.roleForm.save()
        this.roleFormDialog = !this.roleFormDialog
        await this.$nuxt.$loading.finish()
      }
    },
    async handleEditRole(role) {
      this.roleForm = role
      this.roleFormDialog = !this.roleFormDialog
    },
    async handleDeleteRole(role) {
      await this.$confirm(
        "Deseja continuar?",
        "Você está deletando uma regra",
        "question"
      )
        .then(async () => {
          await this.$nuxt.$loading.start()
          await role.delete()
          await this.getRoles()
          await this.$toast.success("Regra deletada com sucesso!")
          await this.$nuxt.$loading.finish()
        })
        .catch((error) => {})
    },
    async handleClearForm() {
      this.$refs.roleFormRef.resetValidation()
      this.roleForm = {
        name: "",
        guard_name: "api",
      }
    },
    async handleEditRolePermission(role) {
      await this.$nuxt.$loading.start()
      this.role = await Role.include("permissions").find(role.id)
      this.rolePermissionsDialog = !this.rolePermissionsDialog
      await this.$nuxt.$loading.finish()
    },
    handleFindPermission(permission) {
      if (!this.role.permissions || !permission) return false
      return !!this.role.permissions.find((item) => item.id === permission.id)
    },
    async handleRemovePermission(permission) {
      await this.$nuxt.$loading.start()
      this.role.revoke_permission = permission.id
      this.role = await this.role.save()
      await this.$nuxt.$loading.finish()
    },
    async handleAssignPermission(permission) {
      await this.$nuxt.$loading.start()
      this.role.give_permission = permission.id
      this.role = await this.role.save()
      await this.$nuxt.$loading.finish()
    },
  },
  computed: {
    ...mapGetters({
      roles: "role/roles",
      permissions: "permission/permissions",
    }),
  },
  watch: {
    roleFormDialog: function () {
      if (!this.roleFormDialog) this.handleClearForm()
    },
  },
}
</script>
