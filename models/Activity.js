import Model from "~/models/Model"

export default class Activity extends Model {
  resource() {
    return "v1/activities"
  }
}
