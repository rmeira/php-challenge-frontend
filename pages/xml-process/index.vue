<template>
  <v-main>
    <AppPageHeader
      icon="mdi-xml"
      title="Processar XML"
      :breadcrumbs="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Processar XML', to: '/xml-process', exact: true },
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
          <v-toolbar-title> Lista de XMLs processados </v-toolbar-title>
          <v-spacer />
          <v-btn
            text
            dark
            @click="xmlProcessFormDialog = !xmlProcessFormDialog"
            v-if="hasPermission('xml-process-store')"
          >
            <v-icon left> mdi-upload </v-icon>
            Fazer Upload
          </v-btn>
          <template v-slot:extension>
            <v-text-field
              label="Pesquisar"
              solo-inverted
              filled
              flat
              clearable
              prepend-inner-icon="mdi-database-search"
              v-model="xmlProcessSearch"
            />
          </template>
        </v-toolbar>
        <v-card-text class="pa-0">
          <client-only>
            <v-data-table
              :headers="xmlProcessHeaders"
              :items="xmlProcess"
              :search="xmlProcessSearch"
            >
              <template v-slot:[`item.file`]="{ item }">
                <v-chip link target="_blank" :href="storageFile(item.file)">
                  <v-icon left>mdi-xml</v-icon> Arquivo</v-chip
                >
              </template>
              <template v-slot:[`item.table`]="{ item }">
                {{
                  xmlOptionsTable.find((option) => option.value === item.table)
                    .name
                }}
              </template>
              <template v-slot:[`item.processed`]="{ item }">
                <v-icon v-if="item.processed" color="success"
                  >mdi-thumb-up</v-icon
                >
                <v-icon v-else color="grey">mdi-thumb-down</v-icon>
              </template>
              <template v-slot:[`item.errors`]="{ item }">
                <v-icon v-if="item.errors" color="success">mdi-thumb-up</v-icon>
                <v-icon v-else color="grey">mdi-thumb-down</v-icon>
              </template>
              <template v-slot:[`item.processed_at`]="{ item }">
                {{
                  item.processed_at
                    ? dateDistance(item.processed_at)
                    : "Arquivo ainda não foi processado"
                }}
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon
                  @click="handleDeleteXmlProcess(item)"
                  v-if="hasPermission('xml-process-delete')"
                >
                  <v-icon color="success"> mdi-delete </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </client-only>
        </v-card-text>
      </v-card>
      <v-dialog max-width="600" v-model="xmlProcessFormDialog" scrollable>
        <v-card flat>
          <v-toolbar dark color="grey darken-2" flat height="80">
            <v-toolbar-title>
              {{
                this.xmlProcessForm.id
                  ? "Atualizar usuário"
                  : "Criar novo usuário"
              }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="xmlProcessFormDialog = !xmlProcessFormDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form
            lazy-validation
            v-model="xmlProcessFormIsValid"
            ref="xmlProcessFormRef"
            @submit.prevent="
              xmlProcessForm.id
                ? handleUpdateXmlProcess()
                : handleCreateXmlProcess()
            "
          >
            <v-card-text>
              <v-file-input
                v-model="file"
                outlined
                prepend-icon=""
                preprend-inner-icon="mdi-file-upload"
                label="Arquivo"
              />
              <v-autocomplete
                v-model="xmlProcessForm.table"
                :items="xmlOptionsTable"
                item-text="name"
                item-value="value"
                outlined
                label="Selecione a tabela"
                :rules="rules.required"
              />
            </v-card-text>
            <v-divider />
            <v-card-actions class="d-flex justify-center pa-4">
              <v-spacer />
              <v-btn type="submit" color="success">
                {{ this.xmlProcessForm.id ? "Atualizar" : "Criar" }}
              </v-btn>
            </v-card-actions>
          </v-form>
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

import XmlProcess from "~/models/XmlProcess"

export default {
  data() {
    return {
      seePassword: false,
      avatar: null,
      cover: null,
      xmlProcessSearch: "",
      xmlProcessHeaders: [
        {
          text: "Arquivo",
          value: "file",
          sortable: false,
          align: "center",
        },
        {
          text: "Tabela",
          value: "table",
        },
        {
          text: "Arquivo processado?",
          value: "processed",
          align: "center",
          sortable: false,
        },
        {
          text: "Teve erros?",
          value: "errors",
          align: "center",
          sortable: false,
        },
        { text: "Processado em", value: "processed_at" },
        {
          text: "Ações",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      xmlProcessFormDialog: false,
      xmlProcessFormIsValid: false,
      xmlProcessForm: {
        file: "",
        table: "",
        processed: "",
        errors: "",
        processed_at: "",
        details: "",
      },
      file: null,
      xmlOptionsTable: [
        {
          name: "Pessoas",
          value: "people",
        },
        {
          name: "Encomendas",
          value: "shiporders",
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
        await this.getXmlProcesss()
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$toast.global.errorData()
        await this.$nuxt.$loading.finish()
      }
    })
  },
  methods: {
    ...mapActions({
      getXmlProcesss: "xmlProcess/getXmlProcesss",
    }),
    async handleDeleteXmlProcess(xmlProcess) {
      await this.$confirm(
        "Você tem certeza que deseja excluir?",
        "Excluir XML a ser processado",
        "question"
      )
        .then(async () => {
          try {
            await this.$nuxt.$loading.start()
            await xmlProcess.delete()
            await this.getXmlProcesss()
            await this.$toast.global.successDelete()
            await this.$nuxt.$loading.finish()
          } catch (error) {
            await this.$toast.global.errorDelete()
            await this.$nuxt.$loading.finish()
          }
        })
        .catch((error) => {})
    },
    async handleCreateXmlProcess() {
      if (this.$refs.xmlProcessFormRef.validate()) {
        try {
          await this.$nuxt.$loading.start()
          this.xmlProcessForm = new XmlProcess(this.xmlProcessForm)
          await this.handleXmlProcessUpload()
          await this.xmlProcessForm.save()
          await this.getXmlProcesss()
          this.xmlProcessFormDialog = !this.xmlProcessFormDialog
          await this.$nuxt.$loading.finish()
        } catch (error) {
          await this.$toast.global.errorStore()
          await this.$nuxt.$loading.finish()
        }
      }
    },
    async handleEditXmlProcess(xmlProcess) {
      this.xmlProcessForm = xmlProcess
      this.xmlProcessFormDialog = !this.xmlProcessFormDialog
    },
    async handleUpdateXmlProcess() {
      if (this.$refs.xmlProcessFormRef.validate()) {
        try {
          await this.$nuxt.$loading.start()
          await this.handleXmlProcessUpload()
          await this.xmlProcessForm.save()
          this.xmlProcessFormDialog = !this.xmlProcessFormDialog
          await this.$nuxt.$loading.finish()
        } catch (error) {
          await this.$toast.global.errorUpdate()
          await this.$nuxt.$loading.finish()
        }
      }
    },
    async handleXmlProcessUpload() {
      if (this.file) {
        const file = await this.handleStorageUpload(
          this.file,
          this.xmlProcessForm.file
        )
        this.xmlProcessForm.file = file
      }
    },

    async handleClearXmlProcessForm() {
      this.$refs.xmlProcessFormRef.resetValidation()
      this.xmlProcessForm = {
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
    async handleEditXmlProcessRoles(xmlProcess) {
      try {
        await this.$nuxt.$loading.start()
        this.xmlProcessForm = await XmlProcess.include("roles").find(
          xmlProcess.id
        )
        this.xmlProcessRoleDialog = !this.xmlProcessRoleDialog
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$toast.global.errorData()
        await this.$nuxt.$loading.finish()
      }
    },
    async handleRemoveXmlProcessRole(role) {
      try {
        await this.$nuxt.$loading.start()
        this.xmlProcessForm.remove_role = role.id
        this.xmlProcessForm = await this.xmlProcessForm.save()
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$toast.global.errorUpdate()
        await this.$nuxt.$loading.finish()
      }
    },
    async handleAssignXmlProcessRole(role) {
      try {
        await this.$nuxt.$loading.start()
        this.xmlProcessForm.assign_role = role.id
        this.xmlProcessForm = await this.xmlProcessForm.save()
        await this.$nuxt.$loading.finish()
      } catch (error) {
        await this.$toast.global.errorUpdate()
        await this.$nuxt.$loading.finish()
      }
    },
    handleXmlProcessFindRole(role) {
      if (!this.xmlProcessForm.roles || !role) return false
      return !!this.xmlProcessForm.roles.find((item) => item.id === role.id)
    },
  },
  computed: {
    ...mapGetters({
      xmlProcess: "xmlProcess/xmlProcess",
    }),
  },
  watch: {
    xmlProcessFormDialog: function () {
      if (!this.xmlProcessFormDialog) this.handleClearXmlProcessForm()
    },
    xmlProcessRoleDialog: function () {
      if (!this.xmlProcessRoleDialog) this.handleClearXmlProcessForm()
    },
  },
}
</script>

<style></style>
