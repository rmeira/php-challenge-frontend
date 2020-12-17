export const storageMixin = {
  methods: {
    storageFile(file) {
      return file ? `${process.env.storage}/v1/storage/${file}` : false
    },
    handleStorageUpload(file, oldFile = null) {
      let formData = new FormData()

      formData.append("file", file)
      formData.append("old_file", oldFile)

      return this.$axios
        .post(`${process.env.api}/v1/storage`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          this.$toast.error(error.response.data)
          return false
        })
    },
  },
}
