import Model from "~/models/Model"

export default class ProfilePermission extends Model {
  resource() {
    return "v1/profile-permissions"
  }
}
