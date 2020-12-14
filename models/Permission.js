import Model from "~/models/Model"

export default class Permission extends Model {
  resource() {
    return "v1/permissions"
  }
}
