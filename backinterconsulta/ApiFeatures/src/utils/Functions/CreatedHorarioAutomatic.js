import { parse, addMinutes, addDays, addHours, getHours, getMinutes, format } from 'date-fns'


const criarNovoHorario = (medico, IntervalosFaltando) => {
  const UltimoHorario = medico.Horarios.length > 0 ? medico.Horarios[medico.Horarios.length - 1] : null

  const ultimaData = UltimoHorario ? UltimoHorario.data : new Date();
  let  novaData = addDays(parse(ultimaData, 'dd/MM/yyyy', new Date()),0)

  if (UltimoHorario && UltimoHorario.fim === '23:59') {
    novaData = addDays(novaData, 1);
  }

  const NovoInicio = UltimoHorario ? addHours(parse(UltimoHorario.inicio, 'HH:mm', new Date()), 1) : new Date() 

  const NovoFim = UltimoHorario ? addHours(parse(UltimoHorario.fim, 'HH:mm', new Date()), 1) : new Date()

  const InicioFormato =  format(NovoInicio, 'HH:mm')
  const FimFormatado =  format(NovoFim, 'HH:mm')
   
  // Conta Horas Dedicadas
  const FimDividido = FimFormatado.split(':')
  const InicioDividido = InicioFormato.split(':')

  const FimDecimal = parseInt(FimDividido[0]) + parseInt(FimDividido[1]) / 60
  const InicioDecimal = parseInt(InicioDividido[0]) + parseInt(InicioDividido[1]) / 60

  const HorasDedicadas = FimDecimal - InicioDecimal
  // Conta Horas Dedicadas

  //Conta AtendimentoDia 
   const ConvertingDecimal = 15 / 60
   const AtendimentosDia = HorasDedicadas / ConvertingDecimal
   const ArredondandoQuantitidadesAtendimentosDia = Math.round(AtendimentosDia)

  //Conta AtendimentoDia
  const novoHorario = {
    data: format(novaData, 'dd/MM/yyyy'),
    inicio:  InicioFormato,
    fim: FimFormatado,
    HorasDedicadas: HorasDedicadas,
    AtendimentosDia:ArredondandoQuantitidadesAtendimentosDia ,
    IntervaloAtendimentos: [],
    Gerado: 'Automaticamente',
  };

  let intervaloInicial = new Date(NovoInicio);

  for (let i = 0; i < IntervalosFaltando; i++) {
    const inicioIntervalo = addMinutes(intervaloInicial, i * 15);
    const fimIntervalo = addMinutes(inicioIntervalo, 15)

    const formatoInicio = format(inicioIntervalo, 'HH:mm');
    const formatoFim = format(fimIntervalo, 'HH:mm');
    
    const intervalo = `${formatoInicio} - ${formatoFim}`;
    novoHorario.IntervaloAtendimentos.push(intervalo);
  }

  return novoHorario
}
