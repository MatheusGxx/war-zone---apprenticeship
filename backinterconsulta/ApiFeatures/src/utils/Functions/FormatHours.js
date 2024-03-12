import { format, sub } from "date-fns"
import { ptBR } from 'date-fns/locale'

export const formatarHoras = (horas) => {
  const date = new Date();
  date.setHours(Math.floor(horas));
  date.setMinutes(Math.round((horas - Math.floor(horas)) * 60));

  return format(date, 'HH:mm', { locale: ptBR });
};

// Usage example:
// const formattedTime = formatarHoras(12.5); // "12:30"
