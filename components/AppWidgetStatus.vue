<template>
  <v-card :color="color" dark class="pa-6">
    <v-layout row wrap align-center>
      <v-flex xs9 class="display-1">
        <h1 class="display-1 font-weight-bold">
          {{ value }}
        </h1>
        <h2 class="overline font-weight-medium">
          {{ status }}
        </h2>
      </v-flex>
      <v-flex xs3>
        <v-icon size="60">
          {{ icon }}
        </v-icon>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      required: true,
    },
  },
}
</script>
