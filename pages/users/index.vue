<template>
  <v-main>
    <AppPageHeader
      icon="mdi-account-group"
      title="Usuários"
      :breadcrumbs="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Usuários', to: '/users', exact: true },
      ]"
    />
    <v-container grid-list-md fluid>
      <v-card class="mt-2">
        <v-toolbar
          dark
          color="grey darken-2"
          flat
          extension-height="70"
          height="80"
        >
          <v-toolbar-title> Lista de usuários </v-toolbar-title>
          <v-spacer />
          <v-btn
            text
            dark
            @click="userFormDialog = !userFormDialog"
            v-if="hasPermission('users-store')"
          >
            <v-icon left> mdi-account-plus </v-icon>
            Criar novo usuário
          </v-btn>
          <template v-slot:extension>
            <v-text-field
              label="Pesquisar"
              solo-inverted
              filled
              flat
              clearable
              prepend-inner-icon="mdi-database-search"
              v-model="usersSearch"
            />
          </template>
        </v-toolbar>
        <v-card-text class="pa-0">
          <client-only>
            <v-data-table
              :headers="usersHeaders"
              :items="users"
              :search="usersSearch"
            >
              <template v-slot:[`item.avatar`]="{ item }">
                <AppAvatar :user="item" />
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="grey darken-2"
                      icon
                      @click="handleEditUser(item)"
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon>mdi-account-edit</v-icon>
                    </v-btn>
                  </template>
                  <span> Atualizar o usuário </span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="info "
                      icon
                      @click="handleEditUserRoles(item)"
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon>mdi-shield-account</v-icon>
                    </v-btn>
                  </template>
                  <span> Atualizar regras do usuário </span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="handleDeleteUser(item)"
                    >
                      <v-icon color="error"> mdi-delete </v-icon>
                    </v-btn>
                  </template>
                  <span> Excluir usuário </span>
                </v-tooltip>
              </template>
            </v-data-table>
          </client-only>
        </v-card-text>
      </v-card>
      <v-dialog max-width="600" v-model="userFormDialog" scrollable>
        <v-card flat>
          <v-toolbar dark color="grey darken-2" flat height="80">
            <v-toolbar-title>
              {{
                this.userForm.id ? "Atualizar usuário" : "Criar novo usuário"
              }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="userFormDialog = !userFormDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form
            lazy-validation
            v-model="userFormIsValid"
            ref="userFormRef"
            @submit.prevent="
              userForm.id ? handleUpdateUser() : handleCreateUser()
            "
          >
            <v-card-text>
              <v-text-field
                v-model="userForm.name"
                outlined
                label="Nome"
                :rules="rules.required"
              />

              <v-text-field
                v-model="userForm.email"
                outlined
                label="E-mail"
                :rules="rules.email"
              />

              <v-text-field
                v-if="!userForm.id"
                v-model="userForm.password"
                label="Senha"
                outlined
                :rules="rules.min8"
                :append-icon="seePassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="seePassword ? 'text' : 'password'"
                counter
                @click:append="seePassword = !seePassword"
                prepend-inner-icon="mdi-lock"
              >
              </v-text-field>
            </v-card-text>
            <v-divider />
            <v-card-actions class="d-flex justify-center pa-4">
              <v-spacer />
              <v-btn type="submit" color="success">
                {{ this.userForm.id ? "Atualizar" : "Criar" }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog max-width="800" v-model="userRoleDialog" scrollable>
        <v-card flat>
          <v-toolbar
            dark
            color="grey darken-2"
            flat
            extension-height="70"
            height="80"
          >
            <v-toolbar-title>
              Atualizar regras do usuário: {{ userForm.name }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="userRoleDialog = !userRoleDialog">
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
                v-model="userRoleSearch"
              />
            </template>
          </v-toolbar>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="roleHeaders"
              :items="roles"
              :search="userRoleSearch"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon
                  @click="
                    handleUserFindRole(item)
                      ? handleRemoveUserRole(item)
                      : handleAssignUserRole(item)
                  "
                >
                  <v-icon color="success" v-if="handleUserFindRole(item)">
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

import { validateMixin } from "~/mixins/validateMixin"
import { storageMixin } from "~/mixins/storageMixin"
import { permissionMixin } from "~/mixins/permissionMixin"

import User from "~/models/User"

export default {
  data() {
    return {
      seePassword: false,
      avatar: null,
      cover: null,
      usersSearch: "",
      usersHeaders: [
        {
          text: "Avatar",
          value: "avatar",
          sortable: false,
          align: "center",
        },
        {
          text: "Nome",
          value: "name",
        },
        { text: "Email", value: "email" },
        {
          text: "Ações",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      userFormDialog: false,
      userFormIsValid: false,
      userForm: {
        name: "",
        email: "",
        password: "",
        avatar: "",
        cover: null,
        active: true,
        employee_id: null,
      },
      avatar: null,
      cover: null,
      userRoleSearch: "",
      userRoleDialog: false,
      roleHeaders: [
        { text: "Nome", value: "name" },
        {
          text: "Ações",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
    }
  },
  mixins: [validateMixin, storageMixin, permissionMixin],
  directives: { mask },
  async mounted() {
    await this.$nextTick(async () => {
      try {
        await this.$nuxt.$loading.start()
        await this.getUsers()
        await this.getRoles()
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$toast.global.errorData()
        await this.$nuxt.$loading.finish()
      }
    })
  },
  methods: {
    ...mapActions({
      getUsers: "user/getUsers",
      getRoles: "role/getRoles",
    }),
    async handleUpdateActiveUser(user) {
      await this.$confirm(
        "Você tem certeza que deseja continuar?",
        user.active ? "Bloquear o usuário?" : "Desbloquear o usuário?",
        "question"
      )
        .then(async () => {
          try {
            await this.$nuxt.$loading.start()
            user.active = !user.active
            await user.save()
            await this.$toast.global.successUpdate()
            await this.$nuxt.$loading.finish()
          } catch (error) {
            await this.$toast.global.errorUpdate()
            await this.$nuxt.$loading.finish()
          }
        })
        .catch((error) => {})
    },
    async handleDeleteUser(user) {
      await this.$confirm(
        "Você tem certeza que deseja continuar?",
        "Excluir usuário",
        "question"
      )
        .then(async () => {
          try {
            await this.$nuxt.$loading.start()
            await user.delete()
            await this.getUsers()
            await this.$toast.global.successDelete()
            await this.$nuxt.$loading.finish()
          } catch (error) {
            await this.$toast.global.errorDelete()
            await this.$nuxt.$loading.finish()
          }
        })
        .catch((error) => {})
    },
    async handleCreateUser() {
      if (this.$refs.userFormRef.validate()) {
        try {
          await this.$nuxt.$loading.start()
          this.userForm = new User(this.userForm)
          await this.handleUserUpload()
          await this.userForm.save()
          await this.getUsers()
          this.userFormDialog = !this.userFormDialog
          await this.$nuxt.$loading.finish()
        } catch (error) {
          await this.$toast.global.errorStore()
          await this.$nuxt.$loading.finish()
        }
      }
    },
    async handleEditUser(user) {
      this.userForm = user
      this.userFormDialog = !this.userFormDialog
    },
    async handleUpdateUser() {
      if (this.$refs.userFormRef.validate()) {
        try {
          await this.$nuxt.$loading.start()
          await this.handleUserUpload()
          await this.userForm.save()
          this.userFormDialog = !this.userFormDialog
          await this.$nuxt.$loading.finish()
        } catch (error) {
          await this.$toast.global.errorUpdate()
          await this.$nuxt.$loading.finish()
        }
      }
    },
    async handleUserUpload() {
      if (this.avatar) {
        const avatar = await this.handleStorageUpload(
          this.avatar,
          this.userForm.avatar
        )
        this.userForm.avatar = avatar
      }
      if (this.cover) {
        const cover = await this.handleStorageUpload(
          this.cover,
          this.userForm.cover
        )
        this.userForm.cover = cover
      }
    },

    async handleClearUserForm() {
      this.$refs.userFormRef.resetValidation()
      this.userForm = {
        name: "",
        email: "",
        password: "",
        avatar: "",
        cover: null,
        active: true,
        employee_id: null,
      }
      this.avatar = null
      this.cover = null
    },
    async handleEditUserRoles(user) {
      try {
        await this.$nuxt.$loading.start()
        this.userForm = await User.include("roles").find(user.id)
        this.userRoleDialog = !this.userRoleDialog
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$toast.global.errorData()
        await this.$nuxt.$loading.finish()
      }
    },
    async handleRemoveUserRole(role) {
      try {
        await this.$nuxt.$loading.start()
        this.userForm.remove_role = role.id
        this.userForm = await this.userForm.save()
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$toast.global.errorUpdate()
        await this.$nuxt.$loading.finish()
      }
    },
    async handleAssignUserRole(role) {
      try {
        await this.$nuxt.$loading.start()
        this.userForm.assign_role = role.id
        this.userForm = await this.userForm.save()
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$toast.global.errorUpdate()
        await this.$nuxt.$loading.finish()
      }
    },
    handleUserFindRole(role) {
      if (!this.userForm.roles || !role) return false
      return !!this.userForm.roles.find((item) => item.id === role.id)
    },
  },
  computed: {
    ...mapGetters({
      users: "user/users",
      roles: "role/roles",
      employees: "employee/employees",
    }),
  },
  watch: {
    userFormDialog: function () {
      if (!this.userFormDialog) this.handleClearUserForm()
    },
    userRoleDialog: function () {
      if (!this.userRoleDialog) this.handleClearUserForm()
    },
  },
}
</script>

<style></style>
