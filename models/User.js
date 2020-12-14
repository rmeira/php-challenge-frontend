import Model from "~/models/Model"

export default class User extends Model {
  resource() {
    return "v1/users"
  }
}
