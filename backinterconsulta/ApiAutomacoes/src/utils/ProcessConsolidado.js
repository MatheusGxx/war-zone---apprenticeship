import { models } from "../../MongoDB/Schemas/Schemas.js"
import { differenceInDays, parse } from 'date-fns'

export const ProcessCosolidado = async (body) => {

    const { inicio, fim, total, consulta, id, EspecialidadeMedica , CPFsPacientes } = body

    const TotalNumber = parseFloat(total)
    console.log(`Orçamento Total da Unidade de Saude: ${TotalNumber}`)
    const ConsultaNumber = parseFloat(consulta)
    console.log(`Valor pago por consulta: ${ConsultaNumber}`)
    const ResultCréditos = TotalNumber / ConsultaNumber
    const CréditNumberFormat = Math.floor(ResultCréditos) 
    console.log(`Credito Atual : ${CréditNumberFormat}`)
  
    const dataInicio = parse(inicio, 'dd/MM/yyyy', new Date())
    const dataFim = parse(fim, 'dd/MM/yyyy', new Date())
    const diferencaEmDias = differenceInDays(dataFim, dataInicio) 
    const ResultFinal = diferencaEmDias + 1
    console.log(`Diferença de dias entre a data Inicio e a Data Fim: ${ResultFinal}`)
    
    const UnidadedeSaude = await models.ModelRegisterUnidadeSaude.findById(id)
    const QuantidadeCasosClinicos = UnidadedeSaude.HistoricoQuantidadeCasosClinicos[UnidadedeSaude.HistoricoQuantidadeCasosClinicos.length -1].QuantidadeCasosClinicos

    console.log(`Quantidade de Casos clinicos ${QuantidadeCasosClinicos}`)

    const AtendimentosMedicosDia  = QuantidadeCasosClinicos / ResultFinal
    const ArrendendandoAtendimentosMedicosDia = Math.ceil(AtendimentosMedicosDia)
    console.log(`Atendimentos necessarios por dia ${ArrendendandoAtendimentosMedicosDia}`)

    const SaudoDisponivel = CréditNumberFormat - QuantidadeCasosClinicos 
    console.log(`Saudo Disponivel: ${SaudoDisponivel}`)

    const MedicosDisponiveis = await models.ModelRegisterMédico.find({
      $and: [
        {
          'Horarios': {
            $elemMatch: {
              data: {
                $gte: inicio,
                $lte: fim,
              }
            }
          }
        },
        {
          'EspecialidadeMedica': EspecialidadeMedica
        }
      ]
    })

    const DataDoctorsDisponiveis = MedicosDisponiveis.map(data => ({ ids: data._id }));

    await models.ModelCasosClinicos.updateMany(
      { CPF: { $in: CPFsPacientes } }, 
      { $push:
        { "MedicosEscolhidos": { $each: DataDoctorsDisponiveis } } 
      }
    );


    const VerifyQuantidadeMedicosDisponiveis = MedicosDisponiveis.map((data) => {
      return data
    })

    if(VerifyQuantidadeMedicosDisponiveis.length === 0){
      return { error: 'Atualmente o Interconsulta nao tem Especialistas que atendam no intervalo de tempo escolhido acima'}
    }

    const QuantidadeMedicosDisponiveis = VerifyQuantidadeMedicosDisponiveis.length

   console.log(`Medicos disponiveis ${QuantidadeMedicosDisponiveis}`)

    const datasUnicas = new Set() // O objeto Set é basicamente um metodo de javascript que nao permite que numeros ou strings se repitam dentro dele, se tiver algum numero repetido ao passar o valor para o set usando a funçao .add() ele ira remover o valor repetido.
    
    MedicosDisponiveis.forEach((medico) => {
      medico.Horarios.forEach((horario) => {
        if (horario.data >= inicio && horario.data <= fim) {
          datasUnicas.add(horario.data)
          //Tira todas as datas iguais cadastradas no meu db do array.
        }
      })
    })
    
    const Datas = Array.from(datasUnicas)
    console.log(`Datas dia médicos ${Datas}`)

    const OrganizandoDatas = Datas.sort((a, b) => {
      const dateA = new Date(a)
      const dateB = new Date(b)
      return dateA - dateB
    })

    console.log(`Datas dos Medicos Organizadas: ${OrganizandoDatas}`);
    console.log(`Inicio: ${OrganizandoDatas[0]}`)
    console.log(`Fim: ${OrganizandoDatas[OrganizandoDatas.length - 1]}`)

    const Inicio = `${OrganizandoDatas[0]}`
    const Fim = `${OrganizandoDatas[OrganizandoDatas.length -1]}`

    const Lenght = Datas.length
    console.log(`Quantidade de Horarios Medicos Disponiveis: ${Lenght}`)
    
    const AtendimentosDiasNoIntervalo = MedicosDisponiveis.flatMap((medico) => {
      return medico.Horarios.filter((horario) => {
          return horario.data >= inicio && horario.data <= fim
      }).flatMap((horarioFiltrado) => {
          return horarioFiltrado.IntervaloAtendimentos.filter((intervalo) => {
              return intervalo.Escolhido === 'Livre'
          })
      })
  })

    const SomaAtendimentosDia = AtendimentosDiasNoIntervalo.length
    console.log(`Quantidade de Atendimentos Médicos que suportamos: ${SomaAtendimentosDia}`)

    const SubstraçaoMessageAtendimentosDia =  SomaAtendimentosDia - QuantidadeCasosClinicos

    const MessageAtendimentosDia = SubstraçaoMessageAtendimentosDia
    console.log(`Agendamentos Faltando: ${MessageAtendimentosDia}`)

     
    const InicioMedico = parse(Inicio, 'dd/MM/yyyy', new Date())
    const FimMedico = parse(Fim, 'dd/MM/yyyy', new Date())

    const DiferençaEntreDiasDosMedicos =  differenceInDays(FimMedico, InicioMedico) + 1
    console.log(`Diferença entre dias perante os Horarios dos Médicos: ${DiferençaEntreDiasDosMedicos}`)

    let Final 

    if(SomaAtendimentosDia >= QuantidadeCasosClinicos){
       Final = '100%'
    }else{
      if(SomaAtendimentosDia < QuantidadeCasosClinicos){
          const PorcentagemAtendimentos = SomaAtendimentosDia / QuantidadeCasosClinicos
          
          Final = (PorcentagemAtendimentos*100).toFixed(2) + '%'
      }
    }
    console.log(`Quantidade de Casos Clinicos que o interconsulta consegue resolver atualmente: ${Final}`)

    const QuantidadeAtendimentoDiaFrase = QuantidadeCasosClinicos /  DiferençaEntreDiasDosMedicos
    console.log(`Quantidade Atendimentos Dia Frase : ${QuantidadeAtendimentoDiaFrase}`)

    const ArrendondamentoDiaFrase = Math.ceil(QuantidadeAtendimentoDiaFrase)
    console.log(`Quantidade de Atendimentos Dia Frase Arredondados ${ArrendondamentoDiaFrase}`)
 
    const DivisãoDiaFrase =  SomaAtendimentosDia / QuantidadeMedicosDisponiveis

    const DivisãoDiaFraseFinal = DivisãoDiaFrase /  DiferençaEntreDiasDosMedicos
    

    let ArrendondamentoDiaFraseFinal 

    if(QuantidadeCasosClinicos > SomaAtendimentosDia ){
      ArrendondamentoDiaFraseFinal = Math.ceil(DivisãoDiaFraseFinal)
    }else if(SomaAtendimentosDia >= QuantidadeCasosClinicos){
      const DivisãoDiaFrase =  QuantidadeCasosClinicos / QuantidadeMedicosDisponiveis
      const countFinal = DivisãoDiaFrase /  DiferençaEntreDiasDosMedicos
      const ArrendondamentoCountFinal = Math.ceil(countFinal)
      ArrendondamentoDiaFraseFinal = ArrendondamentoCountFinal
    }
    console.log(`Quantidade de Atendimentos Dia Final ${ArrendondamentoDiaFraseFinal}`)
     
    const Consolidado = `Se cada médico fizer ${ArrendondamentoDiaFraseFinal} 
    atendimentos por dia, no fim de ${DiferençaEntreDiasDosMedicos} 
    dias, você terá atendido ${Final} dos seus pacientes em ${EspecialidadeMedica}`

    console.log(`Frase para a unidade de Saude : ${Consolidado}.`)

    /*let Custo;
    let CustoEstilizado
    
    if (SomaAtendimentosDia >= QuantidadeCasosClinicos) {
        Custo = QuantidadeCasosClinicos * ConsultaNumber
    
        CustoEstilizado = Custo.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    } else {
        if (SomaAtendimentosDia < QuantidadeCasosClinicos) {
            Custo = SomaAtendimentosDia * ConsultaNumber;
            CustoEstilizado = Custo.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
        }
    }
    console.log(`Orçamento Estimado: ${CustoEstilizado}`)*/

    UnidadedeSaude.GestoesSolicitadas.push({
      Inicio: inicio,
      Fim: fim,
      //OrçamentoEscolhido: TotalNumber,
      ValorPorConsulta: ConsultaNumber,
      CréditosDisponiveis: CréditNumberFormat,
      DiferençaDiasGestor: ResultFinal,
      QuantidadeCasosClinicosPlanilha: QuantidadeCasosClinicos,
      AtendimentoNecessariosDia: ArrendendandoAtendimentosMedicosDia,
      SaudoDisponivel: SaudoDisponivel,
      QuantidadeMedicosDisponiveis: QuantidadeMedicosDisponiveis,
      DatasMedicosDisponiveis: OrganizandoDatas,
      QuantidadeHorariosMedicosDisponiveis: Lenght,
      AtendimentosDiaMedicos: AtendimentosDiasNoIntervalo,
      ValorTotalAtendimentosDiaMedico: SomaAtendimentosDia,
      AgendamentosFaltando: MessageAtendimentosDia,
      DiferençaEntreDiasDosMedicos: DiferençaEntreDiasDosMedicos,
      CasosClinicosSuportados: Final,
      MediaAtendimentosDia: ArrendondamentoDiaFraseFinal,
      FraseFinalConsolidada: Consolidado,
      //OrçamentoEstimado: CustoEstilizado,
      MedicosDisponiveis: VerifyQuantidadeMedicosDisponiveis.map((data) => ({
        Nome: data.nome.toString(),
        Especialidade: data.EspecialidadeMedica.toString(),
        AreadeAtuacao: data.AreadeAtuacao.toString(),
        CRM: data.CRM.toString(),
      }))
     })
     await UnidadedeSaude.save()


    return {
      Inicio,
      Fim,
      SomaAtendimentosDia,
      MessageAtendimentosDia,
      QuantidadeMedicosDisponiveis,
      //CustoEstilizado,
      Consolidado,
      MedicosDisponiveis,
   }
}