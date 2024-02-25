import {
  ConvertingDate,
  ConvertingDateAndTime,
  Medicamentos, 
  Materiais,
  ConvertingIdade
} from '../utils/Functions/Converting.js'
import { differenceInDays, parse } from 'date-fns'
import { titulos } from "../utils/TitulosPlanilha.js"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import xlsx from 'xlsx'
import path from 'path'
import { models } from "../../MongoDB/Schemas/Schemas.js"
import mongoose from 'mongoose';

export const GetPlanilha = async (res) => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFilePath)
  
  const filePath = join(currentDir, '..', 'ModelPlanilha', 'ModelV1.xlsx')

  res.download(filePath, 'ModeloPlanilhaInterconsulta.xlsx', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao fazer o download do arquivo Excel');
    }
  });
}


export const ProcessPlanilha = async (body, res, params, file, filename) =>{

  const { AreadeAtuacao, inicio, fim, total, consulta, } = body
 
  const { id } = params 
  file

  

  if(AreadeAtuacao && inicio && fim && total && consulta){

    const UnidadedeSaude = await models.ModelRegisterUnidadeSaude.findById(id)
     
    const NameUnidade = UnidadedeSaude.nomeInstituicao

    if(UnidadedeSaude){

      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = dirname(currentFilePath)
      
      const filePath = join(currentDir, '../../..', 'planilhas', filename);
      const workbook = xlsx.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonArray = xlsx.utils.sheet_to_json(worksheet)

      const  QueryCasosClinicos = jsonArray.map((data) => ({
        Data: data
      }))

      
      //Validaçao para ver se tem Dados nao preenchidos na planilha
     /* const verificaColunaNaoVazia = (titulo) => {
        const celulasVazias = [];
        jsonArray.forEach((item, index) => {  
          const valorCelula = item[titulo]
          if (valorCelula === undefined || valorCelula === null || valorCelula === '') {
            const celula = xlsx.utils.encode_cell({ r: index + 1, c: titulos.indexOf(titulo) })
            celulasVazias.push(celula) // encode_cell = aceita a linha e a coluna da planilha e te retorna a celula dela
          }
        });
        return celulasVazias;
      }
      
      let errorMessages = []
  
      for (const titulo of titulos) {
        const celulasVazias = verificaColunaNaoVazia(titulo);
        if (celulasVazias.length > 0) {
         const NameUnidade =  UnidadedeSaude.nomeInstituicao
          const errorMessage = ` ${NameUnidade} tem dados da sua planilha faltando na coluna: ${titulo}, Celulas Vazias: ${celulasVazias.join(' , ')} \n`;
          errorMessages.push(errorMessage)
        } else {
          console.log(`Colunas totalmente preenchidas : ${titulo}`);
        }
      }

      if (errorMessages.length > 0) {
        return res.status(400).json({ Error: errorMessages.join('\n') });
      }*/

    let ObjectData = []
      
    const VerifyAreaAtuaçao = jsonArray.map((data) => data.SubEspecialidade)
      const todasIguais = VerifyAreaAtuaçao.every(area => area === AreadeAtuacao) // Compara o Array de AreasdeAtuaçao vindo da planilha com a String Area de Atuaçao vinda do front se for igual passa se nao for nao passa.
        if(todasIguais){ 
            const pacientes = jsonArray.map( async (data) => { // aqui é a conversao de uma planilha do execel para json usando xlsx  
           
              const HistoricoData = {
                Usuario: NameUnidade, 
                UnidadeSaude: data['Unidade-de-Saúde'],
                AreadeAtuacao: AreadeAtuacao,
                Posiçao: data['Posição'],
                MatrículaProntuário: data['Matrícula-Prontuário'],
                CartãoSUS: data['Cartão-SUS'],
                Telefone: data['Telefone'],
                Email: data['Email'],
                Acompanhante: data['Acompanhante'], 
                TelefoneAcompanhante: data['Telefone-Acompanhante'],
                EmailAcompanhante: data['Email-Acompanhante'],
                Endereço: data['Endereço'],
                Cidade: data['Cidade'],
                Estado: data['Estado'],
                Pais: data['Pais'],
                DataInsercao: ConvertingDate(data ,'Data-de-Inserção'),
                Procedimento: data['Procedimento-Doença'],
                CodProcedimento: data['Cod-Procedimento-Doença'],
                CRM: data['CRM'],
                Solicitante: data['Solicitante'],
                Especialidade: data['Especialidade'],
                SubEspecialidade: data['SubEspecialidade'],
                TipoSolicitaçao: data['Tipo-de-Solicitação'],
                Diagnóstico: data['Diagnóstico'],
                Tratamento: data['Tratamento'],
                Medicação: data['Medicação'],
                FerramentaTerapêutica: data['Ferramenta-Terapêutica'],
                ProgressoPaciente: data['Progresso-do-Paciente'],
                RecomendaçõesFuturas: data['Recomendações-Futuras'],
                StatusPaciente: data['Status-do-Paciente'],
                Medicamentos: Medicamentos(data, 'Solicitação-Medicamentos'),
                Material: Materiais(data, 'Solicitação-Materiais'),
                Data: ConvertingDateAndTime(data, 'Validação-Data-Hora'),
              }
              const update = {
                $setOnInsert: {
                  NomePaciente: data['Nome-do-Paciente'],
                  DataNascimento: ConvertingDate(data, 'Data-de-Nascimento'),
                  Sexo: data['Sexo'],
                  EstadoCivil: data['Estado-Civil'],
                  Profissão: data['Profissão'],
                  Idade: ConvertingIdade(data, 'Data-de-Nascimento'),
                  TipoSanguineo: data['Tipo-Sanguineo']
                },
                $addToSet: { 'Historico': HistoricoData }
              }

              const ObjectCPFAndDoencas = {
                CPF: data['CPF'],
                Doenca: data['Procedimento-Doença'],
                NomePaciente: data['Nome-do-Paciente'],
                QuantidadeCasosClinicos: QueryCasosClinicos.length,
                IdentificadorConsulta: new mongoose.Types.ObjectId()
              }

              ObjectData.push(ObjectCPFAndDoencas)

        
              const filter = { 'CPF': data['CPF'] };
              const options = { upsert: true, new: true, setDefaultsOnInsert: true };
          

              const existingPaciente = await models.ModelCasosClinicos.findOneAndUpdate(filter, update, options)
        
              return {
                existingPaciente
              };
            })
            await Promise.all(pacientes)
  
            const TotalNumber = parseFloat(total)
            console.log(`Orçamento Total da Unidade de Saude: ${TotalNumber}`)
            const ConsultaNumber = parseFloat(consulta)
            console.log(`Valor pago por consulta: ${ConsultaNumber}`)
            const ResultCréditos = TotalNumber / ConsultaNumber
            const CréditNumberFormat = Math.floor(ResultCréditos) 
            console.log(`Credito Atual : ${CréditNumberFormat}`)
          
            const dataInicio = parse(inicio, 'dd/MM/yyyy', new Date());
            const dataFim = parse(fim, 'dd/MM/yyyy', new Date());
            const diferencaEmDias = differenceInDays(dataFim, dataInicio) 
            const ResultFinal = diferencaEmDias + 1
            console.log(`Diferença de dias entre a data Inicio e a Data Fim: ${ResultFinal}`)

            const QuantidadeCasosClinicos = QueryCasosClinicos.length
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
                  'AreadeAtuacao': AreadeAtuacao 
                }
              ]
            })

            const VerifyQuantidadeMedicosDisponiveis = MedicosDisponiveis.map((data) => {
              return data
            })
  
            if(VerifyQuantidadeMedicosDisponiveis.length === 0){
              return res.status(404).json({ Error: 'Atualmente o Interconsulta nao tem Especialistas que atendam no intervalo de tempo escolhido acima'})
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
      
            const AtendimentosDiasNoIntervalo = MedicosDisponiveis.map((medico) => {
              return medico.Horarios.filter((horario) => {
                return horario.data >= inicio && horario.data <= fim
              }).map((horarioFiltrado) => {
                return horarioFiltrado.AtendimentosDia
              })
            }).flat()
  
            const SomaAtendimentosDia = AtendimentosDiasNoIntervalo.reduce((total, atendimentos) => total + atendimentos, 0)
            console.log(`Somataria dos Atendimentos Dia dos médicos: ${SomaAtendimentosDia}`)
  
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
         
            const DivisãoDiaFrase =  ArrendondamentoDiaFrase / QuantidadeMedicosDisponiveis

            const ArrendondamentoDiaFraseFinal = Math.ceil(DivisãoDiaFrase)
  
            console.log(`Quantidade de Atendimentos Dia Final ${ArrendondamentoDiaFraseFinal}`)
             
            const Consolidado = `Se cada médico atender ${ArrendondamentoDiaFraseFinal} caso clinico por dia, no fim de ${DiferençaEntreDiasDosMedicos} dias voce tera atendido ${Final} dos seus casos clinicos em ${AreadeAtuacao}`
            console.log(`Frase para a unidade de Saude : ${Consolidado}.`)
  
            let Custo;
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
            console.log(`Orçamento Estimado: ${CustoEstilizado}`)
  
            UnidadedeSaude.GestoesSolicitadas.push({
              AreadeAtuacao: AreadeAtuacao,
              Inicio: inicio,
              Fim: fim,
              OrçamentoEscolhido: TotalNumber,
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
              OrçamentoEstimado: CustoEstilizado,
              MedicosDisponiveis: VerifyQuantidadeMedicosDisponiveis.map((data) => ({
                Nome: data.nome.toString(),
                Especialidade: data.EspecialidadeMedica.toString(),
                AreadeAtuacao: data.AreadeAtuacao.toString(),
                CRM: data.CRM.toString(),
              }))
             })
             await UnidadedeSaude.save()
  
     
            return res.status(200).json({
              Inicio,
              Fim,
              SomaAtendimentosDia,
              MessageAtendimentosDia,
              QuantidadeMedicosDisponiveis,
              CustoEstilizado,
              Consolidado,
              MedicosDisponiveis,
              ObjectData
          })
            
          }else{
            return res.status(404).json({ Error: 'Area de Atuaçao escolhida é imcompativel com a da planilha escolhida abaixo'})
          } 
        }
    
     }else{
      return res.status(400).json({ Error: 'Unidade de Saude nao esta Cadastrada no Interconsulta'})
     }
      
}