<template>
  <v-main>
    <v-container fluid grid-list-md fill-height>
      <v-layout justify-center align-center>
        <v-flex xs8 sm8 md6 lg6>
          <v-card class="transparent text-center" elevation="0">
            <h1 class="font-weight-bold text-uppercase display-1">
              {{ error.statusCode === 404 ? pageNotFound : otherError }}
            </h1>

            <v-btn
              color="primary"
              nuxt
              rounded
              to="/"
              width="250"
              large
              class="mt-5"
            >
              Home page
            </v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
export default {
  layout: 'simple',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'Pagina não encontrada',
      otherError: 'Ops, ocorreu um erro',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>
