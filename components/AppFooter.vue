<template>
  <v-footer app inset absolute>
    <v-card-text dark class="text-center pt-1 pb-1">
      Criado com
      <v-icon color="red" class="ma-1">mdi-heart</v-icon> por
      <a
        href="https://rafaelmeira.com.br/"
        target="_blank"
        class="font-weight-bold"
        style="text-decoration: none"
        >Rafael Meira
      </a>
      - Versão: {{ version }} - © {{ date.getFullYear() }}
      . Todos os direitos reservados.
    </v-card-text>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      version: process.env.version,
      date: new Date(),
    }
  },
}
</script>
