import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const DATE_TIME_FORMAT = {
  FULL: "eeee dd/MM/yyyy HH:mm",
  DATE_TIME: "dd/MM/yyyy HH:mm",
  DATE: "eeee dd/MM/yyyy",
  TIME: "HH:mm",
  ISO_DATE: "yyyy-MM-dd",
  ISO_DATE_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'",
};

export const formatDateTime = (
  date: Date,
  stringFormat: string = DATE_TIME_FORMAT.DATE_TIME
) => {
  return format(date, stringFormat, { locale: vi });
};
