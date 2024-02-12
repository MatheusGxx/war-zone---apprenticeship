import { parse, isWithinInterval, addMinutes, isAfter, differenceInMinutes } from 'date-fns'


export const ValidatorDateAndTime = (DateQuery, TimeStart, TimeEnd) => { // Verifica se a Data da consulta ta dentro da data da consulta
  const DateStart = parse(`${DateQuery} ${TimeStart}`, 'dd/MM/yyyy HH:mm', new Date());
  const DateEnd = parse(`${DateQuery} ${TimeEnd}`, 'dd/MM/yyyy HH:mm', new Date());

  const DateNow = new Date()
  
  // Cria um intervalo que representa o período exato da consulta
  const ConsultationInterval = {
    start: DateStart,
    end: DateEnd,
  };

  // Verifica se a data atual está dentro do intervalo exato da consulta
  return isWithinInterval(DateNow, ConsultationInterval);
};


export const calculateTimeDifference = (dataConsulta, horaInicio, horaFim) => {
  const agora = new Date();
  const dataInicioConsulta = parse(`${dataConsulta} ${horaInicio}`, 'dd/MM/yyyy HH:mm', new Date());
  const dataFimConsulta = parse(`${dataConsulta} ${horaFim}`, 'dd/MM/yyyy HH:mm', new Date());

  if (isAfter(agora, dataFimConsulta)) {
    return 'Consulta Expirada'
  } else {
    const dataInicioAjustada = addMinutes(dataInicioConsulta, 1)
    const minutosRestantes = Math.max(0, differenceInMinutes(dataInicioAjustada, agora))
    return minutosRestantes;
  }
};