import { format } from "date-fns"
import { ptBR } from 'date-fns/locale/index.js'

export const formatarHoras = (horas) => {
  const horasInteiras = Math.floor(horas);
  const minutosFracionarios = (horas - horasInteiras) * 60;

  const date = new Date(0);
  date.setHours(horasInteiras);
  date.setMinutes(minutosFracionarios);

  return format(date, 'HH:mm', { locale: ptBR });
};