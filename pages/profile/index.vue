<template>
  <div>
    <AppPageHeader
      icon="mdi-account"
      title="Perfil"
      :breadcrumbs="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Perfil', to: '/profile', exact: true },
      ]"
    />
    <v-container grid-list-lg fluid>
      <v-card>
        <v-toolbar dark color="grey darken-2" flat>
          <v-toolbar-title> Meu perfil </v-toolbar-title>
        </v-toolbar>
        <v-form
          lazy-validation
          ref="userFormRef"
          @submit.prevent="handleUpdateUser()"
        >
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="userForm.name" label="Nome" outlined />
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field
                  v-model="$auth.user.email"
                  label="Email"
                  readonly
                  outlined
                />
              </v-flex>
            </v-layout>
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
      },
    }
  },
  mixins: [dateMixin, storageMixin],
  mounted() {
    this.userForm.name = this.$auth.user.name
    this.userForm.email = this.$auth.user.email
  },
  methods: {
    async handleUpdateUser() {
      if (this.$refs.userFormRef.validate()) {
        try {
          await this.$nuxt.$loading.start()
          await this.handleUserUpload()
          await this.$axios.put(`${process.env.api}/v1/profile`, this.userForm)
          await this.$auth.fetchUser()
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
  },
}
</script>

<style></style>
