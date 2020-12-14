<template>
  <v-btn text icon large to="/profile" nuxt class="mr-1">
    <v-avatar size="45" color="elevation-2">
      <v-img
        :src="$auth.user.avatar ? storageFile($auth.user.avatar) : avatar"
        :alt="$auth.user.first_name"
      ></v-img>
    </v-avatar>
  </v-btn>
</template>

<script>
import avatar from '~/assets/images/avatar.png'
import { storageMixin } from '~/mixins/storageMixin'

export default {
  mixins: [storageMixin],
  data() {
    return {
      avatar,
    }
  },
}
</script>
