import { parse, isWithinInterval, addMinutes, isAfter, differenceInMinutes } from 'date-fns'

export const ValidatorDateAndTime = (DateQuery, TimeStart, TimeEnd) => { // Verifica se esta na Hora da Consulta
  
  // Adicionar + 5 minutos pro paciente poder entrar 5 minutos atrasado quando der a Hora da Consulta
  try{

    const DateStart = parse(`${DateQuery} ${TimeStart}`, 'dd/MM/yyyy HH:mm', new Date())

    const DateEnd = parse(`${DateQuery} ${TimeEnd}`, 'dd/MM/yyyy HH:mm', new Date())
  
    const DateNow = new Date();
        
    // Cria um intervalo que representa o período exato da consulta
    const ConsultationInterval = {
      start: DateStart,
      end: DateEnd,
    }
  
    // Verifica se a data atual está dentro do intervalo exato da consulta
    return isWithinInterval(DateNow, ConsultationInterval)
  }catch(err){
    console.log(err)
  }
}

export const calculateTimeDifference = (dataConsulta, horaInicio, horaFim) => { // Se nao estiver na hora da Consulta, a função verifica quantos minutos faltam
     // Adicionar -5 minutos para o paciente conseguir entrar 5 minutos antes de dar a consulta 
  try{
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
  }catch(err){
    console.log(err)
  }

}