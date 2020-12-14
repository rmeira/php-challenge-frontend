<template>
  <v-card
    class="d-flex text-center align-center justify-center grey lighten-4"
    min-height="180"
    nuxt
    :to="route"
    active-class="grey lighten-2"
  >
    <span>
      <v-icon size="80" :color="color"> {{ icon }} </v-icon>
      <h1 class="grey--text text--darken-2 text-uppercase title">{{ name }}</h1>
    </span>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
  },
}
</script>

<style></style>
