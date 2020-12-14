<template>
  <div>
    <AppPageHeader
      icon="mdi-lock"
      title="Senha"
      :breadcrumbs="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Perfil', to: '/profile', exact: true },
        { text: 'Senha', to: '/profile/password', exact: true },
      ]"
    />
    <v-container grid-list-lg fluid>
      <v-card>
        <v-toolbar dark color="grey darken-2" flat>
          <v-toolbar-title> Alterar senha </v-toolbar-title>
        </v-toolbar>
        <v-form
          lazy-validation
          ref="userFormRef"
          @submit.prevent="handleUpdateUser()"
        >
          <v-card-text>
            <v-text-field
              v-model="userForm.password"
              outlined
              label="Nova senha"
              :rules="rules.min8"
              type="password"
            />
            <v-text-field
              v-model="userForm.confirmPassword"
              outlined
              label="Confirme a nova senha"
              :rules="[
                ...rules.min8,
                (v) =>
                  userForm.password === userForm.confirmPassword ||
                  'Confirmação de senha não bate com a nova senha',
              ]"
              type="password"
            />
          </v-card-text>
          <v-divider class="my-2 mt-0" />
          <v-card-actions>
            <v-icon class="mr-2" small>mdi-clock</v-icon>
            <span class="caption grey--text font-weight-light">
              Atualizado a última vez há
              {{ dateDistance($auth.user.updated_at) }}
            </span>
            <v-spacer />
            <v-btn type="submit" color="success"> Atualizar </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { dateMixin } from "~/mixins/dateMixin"
import { storageMixin } from "~/mixins/storageMixin"
import { validateMixin } from "~/mixins/validateMixin"

export default {
  head() {
    return {
      title: "Perfil",
    }
  },
  data() {
    return {
      avatar: null,
      cover: null,
      userForm: {
        name: "",
        avatar: null,
        cover: null,
        password: null,
      },
    }
  },
  mixins: [dateMixin, storageMixin, validateMixin],
  mounted() {
    this.userForm.name = this.$auth.user.name
    this.userForm.email = this.$auth.user.email
  },
  methods: {
    async handleUpdateUser() {
      if (this.$refs.userFormRef.validate()) {
        try {
          await this.$nuxt.$loading.start()
          await this.$axios.put(`${process.env.api}/v1/profile`, this.userForm)
          await this.$auth.fetchUser()
          await this.$toast.global.successUpdate()
          await this.$nuxt.$loading.finish()
        } catch (error) {
          await this.$toast.global.errorUpdate()
          await this.$nuxt.$loading.finish()
        }
      }
    },
  },
}
</script>

<style></style>
