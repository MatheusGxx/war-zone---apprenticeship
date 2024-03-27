import { EspecialidadesAtendidas } from '../utils/EspecialidadesAtendidas.js'
import { models } from "../../MongoDB/Schemas/Schemas.js"
import { parse, eachMinuteOfInterval, format } from "date-fns"
import { utcToZonedTime } from 'date-fns-tz';
import { formatarHoras } from '../utils/Functions/FormatHours.js'

export const getInfosMedico = async (params, res) =>{

  const { id } = params 

  try{
    const getMedico = await models.ModelRegisterMédico.findById(id)
   
    if(getMedico){
     const InformacoesMedico = getMedico
     return res.status(200).json({ InformacoesMedico })
    }else{
     return res.status(404).json({ message: 'Medico nao cadastrado no banco de dados do interconsulta'})
    }
  }catch(e){
    console.log(e)
  }
}

export const GetSlug = async (params, res) =>{
  const { id } = params

  try{
    const ModelMedico = await models.ModelRegisterMédico.findById(id)

    if(ModelMedico){
      const SlugMedico = ModelMedico.Slug
      return res.status(200).json({ SlugMedico })
    }else{
      return res.status(404).json({ message: 'Medico nao esta cadastrado no banco de dados do interconsulta =/'})
    }
  }catch(e){
    console.log(e)
  }
}

export const RegisterHorarios = async (body, res, params) =>{
  const { data, inicio, fim, TempoConsulta  } = body

  const { id }  = params

  try{
    const Medico = await models.ModelRegisterMédico.findById(id)

  if(Medico){

    const TempoConsultaNumber = parseInt(TempoConsulta)

    let TempoConsultaOriginal 

    switch(TempoConsultaNumber){
      case 15:
        TempoConsultaOriginal = 1
      break
      case 30:
        TempoConsultaOriginal = 2
      break
      case 45:
        TempoConsultaOriginal = 3
      break
      case 60:
        TempoConsultaOriginal = 4
      break
    }

    const ValorConsulta = Medico.PrecoConsulta

    const RendMedica = TempoConsultaOriginal * ValorConsulta

    const StringFim = fim
    const StringInicio = inicio

    const HorasTotaisFim = StringFim + ':00'
    const HorasTotaisInicio = StringInicio + ':00'

    const DividindoEmStringFim = HorasTotaisFim.split(':')
    const DividindoEmStringInicio =  HorasTotaisInicio.split(':')
 
    const FimDecimal = parseInt(DividindoEmStringFim[0]) + parseInt(DividindoEmStringFim[1]) / 60
    const InicioDecimal = parseInt(DividindoEmStringInicio[0]) + parseInt(DividindoEmStringInicio[1]) / 60
  
    const HorasDedicadas = FimDecimal - InicioDecimal
    
     // Converter as strings de início e fim para objetos de hora
    const horaInicio = parse(`${data} ${inicio}`, 'dd/MM/yyyy HH:mm', new Date())
    const horaFim = parse(`${data} ${fim}`, 'dd/MM/yyyy HH:mm', new Date())
    
    const ExistingHorario = Medico.Horarios.find(horario => horario.data === data)
    if(ExistingHorario){
        
      const DuplicateHorario = Medico.Horarios.find(horario => horario.data === data && horario.inicio === inicio && horario.fim === fim)

      if(DuplicateHorario){
        return res.json({ message: `${Medico.NomeEspecialista} o horario selecionado esta duplicado, por favor escolha outro`})
      }

      const getIntervals = ExistingHorario.IntervaloAtendimentos.map(data => data.Intervalo)

      const timeZone = 'America/Sao_Paulo'; // Defina o fuso horário desejado

      const IntervalosDisponiveis = getIntervals.map(interval => {
        const [startString, endString] = interval.split(' - ');
        const startDate = utcToZonedTime(parse(`${data} ${startString}`, 'dd/MM/yyyy HH:mm', new Date()), timeZone);
        const endDate = utcToZonedTime(parse(`${data} ${endString}`, 'dd/MM/yyyy HH:mm', new Date()), timeZone);
        return { startDate, endDate };
      })

      const IntervalosAtuais = eachMinuteOfInterval({
        start: horaInicio,
        end: parse(`${data} ${fim}`, 'dd/MM/yyyy HH:mm', new Date()),
      }, { step: TempoConsultaNumber })


      const menorData = IntervalosAtuais[0]
      const existeDataInicialIgualInicial = IntervalosDisponiveis.some(intervalo => {
        return intervalo.startDate.getTime() === menorData.getTime();
       })

     const maiorData = IntervalosAtuais[IntervalosAtuais.length -1]

     const existeDataInicialIgualFinal = IntervalosDisponiveis.some(intervalo => {
      return intervalo.endDate.getTime() === maiorData.getTime();
     })
     console.log(existeDataInicialIgualFinal)

     if (existeDataInicialIgualInicial || existeDataInicialIgualFinal) {
        return res.json({ message: 'O horario cadastrado esta Duplicando Intervalos ja existentes, Logo foi recusado.'})
    } 
      
    const intervalos = eachMinuteOfInterval({
       start: horaInicio,
       end: parse(`${data} ${fim}`, 'dd/MM/yyyy HH:mm', new Date()),
    }, { step: TempoConsultaNumber })
     
    const intervalosFormatados = intervalos.slice(0, -1).map((horaInicio, index) => {// Tirando o Ultimo Horario do array para criar o Horario Inicio 
      const horaFim = intervalos[index + 1] // Pegando sempre +1 do array de intervalos de horas formatadas de meia em meia hora para formar a Hora fim que sera sempre os Horarios que tem :30
        return {
          Intervalo: `${format(horaInicio, 'HH:mm')} - ${format(horaFim, 'HH:mm')}`,
          Escolhido: 'Livre',
        }
    })

    const novosIntervalos = intervalosFormatados.filter(intervalo => {
      return !ExistingHorario.IntervaloAtendimentos.some(existing => existing.Intervalo === intervalo.Intervalo);
    });
    
    // Adicionar os novos intervalos
    ExistingHorario.IntervaloAtendimentos = ExistingHorario.IntervaloAtendimentos.concat(novosIntervalos)

     const Existing = ExistingHorario.IntervaloAtendimentos.sort((a, b) => {
      const timeA = parse(a.Intervalo.split(' - ')[0], 'HH:mm', new Date());
      const timeB = parse(b.Intervalo.split(' - ')[0], 'HH:mm', new Date());
      return timeA - timeB;
    });

      const primeiroIntervalo = Existing[0]
      const ultimoIntervalo = Existing[Existing.length - 1]
      
      const inicioPrimeiroIntervalo = primeiroIntervalo.Intervalo.split(' - ')[0]
      const inicioUltimoIntervalo = ultimoIntervalo.Intervalo.split(' - ')[1]
      
      ExistingHorario.inicio = inicioPrimeiroIntervalo
      ExistingHorario.fim = inicioUltimoIntervalo

      await Medico.save()
    }else{  

        const intervalos = eachMinuteOfInterval({
          start: horaInicio,
          end: parse(`${data} ${fim}`, 'dd/MM/yyyy HH:mm', new Date()),
        }, { step: TempoConsultaNumber })
       
        const intervalosFormatados = intervalos.slice(0, -1).map((horaInicio, index) => {// Tirando o Ultimo Horario do array para criar o Horario Inicio 
          const horaFim = intervalos[index + 1] // Pegando sempre +1 do array de intervalos de horas formatadas de meia em meia hora para formar a Hora fim que sera sempre os Horarios que tem :30
          return {
            Intervalo: `${format(horaInicio, 'HH:mm')} - ${format(horaFim, 'HH:mm')}`,
            Escolhido: 'Livre',
          }
        })
      
        Medico.Horarios.push({ data, inicio, fim, HorasDedicadas, AtendimentosDia: 0, IntervaloAtendimentos: intervalosFormatados, TempoDeConsulta: TempoConsultaNumber})
        await Medico.save()

        const ConvertingTempodeAtendimentoDecimal = 15 / 60
 
        const HorasD = Medico.Horarios[Medico.Horarios.length -1].HorasDedicadas
        const QuantidadedeAtendimentos =  HorasD / ConvertingTempodeAtendimentoDecimal
    
        const ArredondandoQuantitidadesAtendimentos = Math.ceil(QuantidadedeAtendimentos)
  
        // Atualizando apenas o novo AtendimentosDia com base no último cadastrado
        Medico.Horarios[Medico.Horarios.length - 1].AtendimentosDia = ArredondandoQuantitidadesAtendimentos
        
       
        //Total de Atendimentos
        const getAtendimentosDia = Medico.Horarios.map((data) => data.AtendimentosDia)
    
        const TotaisAtendimentos = getAtendimentosDia.reduce((total, atendimentos) => total + atendimentos, 0)
    
        Medico.TotalAtendimentos = TotaisAtendimentos
    
        await Medico.save()
    }

    //Mensagem Front End

    const IntervalosAtendimentos = Medico.Horarios.map((data) => data.IntervaloAtendimentos);
    const todosOsIntervalos = IntervalosAtendimentos.flatMap((data) => data.map((intervalo) => intervalo.Intervalo))

    const QuantidadeIntervalos = todosOsIntervalos.length

    const QuantidadeAtendimentosHora = 60 / TempoConsultaNumber

    const Horas = QuantidadeIntervalos  / QuantidadeAtendimentosHora
    console.log(`Horas: ${Horas}`)
    
    const RendaMedica = QuantidadeIntervalos * 80
      
    // Formatação da Renda Médica em formato de dinheiro
    const RendaFormatada = RendaMedica.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
     })

     let mensagem = ''
   
     if (Horas === 1) {
      mensagem = `${Medico.NomeEspecialista}, se você se dedicar ${formatarHoras(Horas)} hora no interconsulta, você pode ter uma renda de até ${RendaFormatada} como ${Medico.EspecialidadeMedica}`;
    } else {
      const minutos = Math.round(Horas * 60); // Arredondar para o número inteiro mais próximo
      const horas = Math.floor(minutos / 60);
      const minutosRestantes = minutos % 60;
    
      if (horas > 0 && minutosRestantes > 0) {
        mensagem = `${Medico.NomeEspecialista}, se você se dedicar ${horas} horas e ${minutosRestantes} minutos no interconsulta, você pode ter uma renda de até ${RendaFormatada} como ${Medico.EspecialidadeMedica}`;
      } else if (horas > 1) {
        mensagem = `${Medico.NomeEspecialista}, se você se dedicar ${horas} horas no interconsulta, você pode ter uma renda de até ${RendaFormatada} como ${Medico.EspecialidadeMedica}`;
      } else {
        mensagem = `${Medico.NomeEspecialista}, se você se dedicar ${minutosRestantes} minutos no interconsulta, você pode ter uma renda de até ${RendaFormatada} como ${Medico.EspecialidadeMedica}`;
      }
    }
    
    return res.status(200).json({ message: mensagem });

  }else{
    return res.status(404).json({ message: 'Medico nao cadastrado no banco de dados'})
  }
  }catch(error){
    console.log(error)
  }
}


export const getHorarios = async (params, res) =>{
   const { id } = params

   try{
    const ModelMedico = await models.ModelRegisterMédico.findById(id)

    if(ModelMedico){
      const QueryHistorico = ModelMedico.Horarios
      return res.status(200).json({ QueryHistorico })
    }else{
      return res.status(400).json({ message: 'Medico nao existe no banco de dados do interconsulta =/'})
    }
   }catch(e){
    console.log(e)
   }
}

export const deleteHorarios = async (params, res) => {
  const { id, idH } = params

  try{
    const ModelMedico = await models.ModelRegisterMédico.findById(id)

    if (ModelMedico) {
      // Encontre o horário no array Horarios com base no idHorario
      const horario = ModelMedico.Horarios.find((horario) => horario.idH === idH)
      
      const IntervalosAtendimentos = horario.IntervaloAtendimentos.map((data) => data.Intervalo)
      
      const QuantidadeAtendimentosHorario = IntervalosAtendimentos.length 
      console.log(QuantidadeAtendimentosHorario)
  
      if (horario) {
        // Exclua o horário do MongoDB com base no _id do horário
        await models.ModelRegisterMédico.findByIdAndUpdate(id, {
          $pull: { Horarios: { _id: horario._id } },
        });
  
        //Mensagem Front End
        const IntervalosAtendimentos = ModelMedico.Horarios.map((data) => data.IntervaloAtendimentos)
  
        const todosOsIntervalos = IntervalosAtendimentos.flatMap((data) => data.map((intervalo) => intervalo.Intervalo))
    
        const QuantidadeIntervalos = todosOsIntervalos.length - QuantidadeAtendimentosHorario
      
        const QuantidadeAtendimentosHora = 60 / 15
    
        const Horas = QuantidadeIntervalos / QuantidadeAtendimentosHora
    
        const RendaMedica = QuantidadeIntervalos * 80
  
        const RendaFormatada = RendaMedica.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
         })
        
       
         let mensagem = ''
     
         if (Horas === 1) {
          mensagem = `${ModelMedico.NomeEspecialista}, se você se dedicar ${formatarHoras(Horas)} hora no interconsulta, você pode ter uma renda de até ${RendaFormatada} como ${ModelMedico.EspecialidadeMedica}`;
        } else {
          const minutos = Math.round(Horas * 60); // Arredondar para o número inteiro mais próximo
          const horas = Math.floor(minutos / 60);
          const minutosRestantes = minutos % 60;
        
          if (horas > 0 && minutosRestantes > 0) {
            mensagem = `${ModelMedico.NomeEspecialista}, se você se dedicar ${horas} horas e ${minutosRestantes} minutos no interconsulta, você pode ter uma renda de até ${RendaFormatada} como ${ModelMedico.EspecialidadeMedica}`;
          } else if (horas > 1) {
            mensagem = `${ModelMedico.NomeEspecialista}, se você se dedicar ${horas} horas no interconsulta, você pode ter uma renda de até ${RendaFormatada} como ${ModelMedico.EspecialidadeMedica}`;
          } else {
            mensagem = `${ModelMedico.NomeEspecialista}, se você se dedicar ${minutosRestantes} minutos no interconsulta, você pode ter uma renda de até ${RendaFormatada} como ${ModelMedico.EspecialidadeMedica}`;
          }
        }
      return res.status(200).json({ mensagem })
      }
    } else {
      return res
        .status(400)
        .json({ message: 'Médico não encontrado no banco de dados do Interconsulta' });
    }
  }catch(e){
    console.log(e)
  }
 
}


export const VerifyMedico = async(params, res) => {

  const { id } = params

  try{
    const ModelMedico = await models.ModelRegisterMédico.findById(id)
    if(ModelMedico){
      const QueryHorariosMedico = ModelMedico.Horarios
      return res.status(200).json({ QueryHorariosMedico })
    }else{
      return res.status(404).json({ message: 'Medico nao esta cadastrado no banco de dados do interconsulta =/'})
    }
  }catch(e){
    console.log(e)
  }

}


export const getCasosClinicos = async (params, res) => {
  const { id } = params


  try{
    const ModelMedico = await models.ModelRegisterMédico.findById(id);

    if (!ModelMedico) {
      return res.status(404).json({ message: 'Médico não está cadastrado no banco de dados do interconsulta =/' });
    }
  
    const Especialidade = ModelMedico.EspecialidadeMedica
  
    const EspecialidadeEncontrada = EspecialidadesAtendidas.includes(Especialidade);
  
    if (EspecialidadeEncontrada) {
      const ImageEspecialidade = `icons/${EspecialidadeEncontrada}.png`
  
      const documentosEspecialidade = await models.ModelCasosClinicos.find({
        'Historico': {
          $elemMatch: {
            'EspecialidadeMedica': EspecialidadeEncontrada
          }
        }
      })
     
      if (documentosEspecialidade.length > 0) {
       
          await models.ModelCasosClinicos.updateMany(
          {
            'Historico': {
              $elemMatch: {
                'EspecialidadeMedica': EspecialidadeEncontrada
              }
            }
          },
          {
            $set: {
              'Historico.$[elem].FotoEspecialidade': ImageEspecialidade
            }
          },
          {
            arrayFilters: [
              {
                'elem.EspecialidadeMedica': EspecialidadeEncontrada
              }
            ]
          }
        )
  
        const HistoricoCasosClinicos = await models.ModelCasosClinicos.find({
          'Historico': {
            $elemMatch: {
              'EspecialidadeMedica': EspecialidadeEncontrada
            }
          }
        })
  
        res.status(200).json({ HistoricoCasosClinicos })
        
  
      } else {
        console.log('Especialidade não encontrada em nenhum histórico.');
        return res.status(404).json({ message: 'Especialidade não encontrada em nenhum histórico.' });
      }
    } else {
      return res.status(400).json({ message: 'Especialidade Errada' });
    }
  }catch(e){
    console.log(e)
  }

}


export const DeleteIntervalo = async (params, res ) =>{
  const { id, idHorarioo } = params

  try{
    const DeleteIntervalo = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'Horarios.IntervaloAtendimentos._id': id },
      {
        $pull: {
          'Horarios.$.IntervaloAtendimentos': { _id: id }
        }
      }
    )
  
    const getHorarioforID = await models.ModelRegisterMédico.findOne({
      'Horarios._id': idHorarioo
    })
    
    const getHorarios = getHorarioforID.Horarios;
  
    const getIntervaloInicial = getHorarios
      .flatMap((interval) =>
        interval.IntervaloAtendimentos.map((data) => data.Intervalo)
      )
   
    if(getIntervaloInicial.length > 0){
      const primeiroHorario = getIntervaloInicial[0]
      const ultimoHorario = getIntervaloInicial[getIntervaloInicial.length - 1]
    
      const SplitPrimeiroHorario = primeiroHorario.split(' - ')[0]
      const SplitUltimoHorario =  ultimoHorario.split(' - ')[1]
    
      const UpdateInicioAndFimHorario = await models.ModelRegisterMédico.findOneAndUpdate(
      {
        'Horarios._id': idHorarioo
      },
      {
        $set:{
          'Horarios.$.inicio' : SplitPrimeiroHorario,
          'Horarios.$.fim': SplitUltimoHorario 
        }
      },
      { new: true }
      )
    }else{
  
      const getMedico = await models.ModelRegisterMédico.findOneAndUpdate(
        { 'Horarios._id': idHorarioo },
        { $pull: { 'Horarios': { _id: idHorarioo } } },
        { new: true }
      )
    }
  
    if(DeleteIntervalo){
      res.status(200).json({ message: 'Intervalo Excluido com sucesso'})
    }
  }catch(e){
    console.log(e)
  }
} 


export const VerifyRegisterTottalySuccess = async (email, res) => {
   try{
     const getDoctor = await models.ModelRegisterMédico.findOne({ email: email })

     if(!getDoctor){
      return res.status(200).json({ message: 'Doctor of not existing in Database of Interconsulta'})
     }

     const CRMMédico = getDoctor.CRM

     if(CRMMédico){
       return res.status(200).json({ valid: true })
     }else{
      return res.status(200).json({ valid: false })
     }
   }catch(err){
    return res.status(400).json({ message: 'Error in ValidatorRegisterTottaly of Doctor'})
   }
}
