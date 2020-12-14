<template>
  <v-avatar :size="size" color="elevation-1">
    <v-img :src="avatar"></v-img>
  </v-avatar>
</template>

<script>
import avatar from "~/assets/images/avatar.png"
import { storageMixin } from "~/mixins/storageMixin"

export default {
  props: {
    size: {
      type: Number,
      default: 30,
    },
    user: {
      type: Object,
    },
  },
  data() {
    return {
      avatar,
    }
  },
  mixins: [storageMixin],
}
</script>

<style></style>
