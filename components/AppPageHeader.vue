<template>
  <v-toolbar flat height="60">
    <v-toolbar-title class="title grey--text text--darken-2">
      <v-icon class="mb-1" left>{{ icon }}</v-icon>
      {{ title }}
    </v-toolbar-title>
    <v-spacer />
    <v-breadcrumbs
      class="font-weight-black hidden-sm-and-down"
      :items="breadcrumbs"
    ></v-breadcrumbs>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
    breadcrumbs: {
      type: Array,
    },
  },
}
</script>
