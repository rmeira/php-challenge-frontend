import Model from "~/models/Model"

export default class Role extends Model {
  resource() {
    return "v1/roles"
  }
}
