import Model from "~/models/Model"

export default class ProfileRole extends Model {
  resource() {
    return "v1/profile-roles"
  }
}
