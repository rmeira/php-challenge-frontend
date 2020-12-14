import { format, formatDistanceToNow } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

export const dateMixin = {
  data() {
    return {
      date: new Date(),
    }
  },
  methods: {
    dateFormat(date) {
      return format(new Date(date ? date : null), "dd/MM/yyyy HH:mm:ss")
    },
    dateFormatSimpleDate(date) {
      return format(new Date(date ? date : null), "dd/MM/yyyy")
    },
    dateFormatDateToEn(date) {
      return format(new Date(date ? date : null), "yyyy-MM-dd HH:mm:ss.SSS")
    },
    dateFormatDateToEnSimple(date) {
      return format(new Date(date ? date : null), "yyyy-MM-dd")
    },
    dateFormatYearMonthToEnSimple(date) {
      return format(new Date(date ? date : null), "yyyy-MM")
    },
    dateDistance(date) {
      return formatDistanceToNow(new Date(date ? date : null), {
        addSuffix: false,
        includeSeconds: false,
        locale: ptBR,
      })
    },
  },
  computed: {
    dateTodaySimple() {
      return format(new Date(), "yyyy-MM-dd")
    },
    dateLastThirtyDaysSimple() {
      return format(new Date().setDate(new Date().getDate() - 30), "yyyy-MM-dd")
    },
  },
}
