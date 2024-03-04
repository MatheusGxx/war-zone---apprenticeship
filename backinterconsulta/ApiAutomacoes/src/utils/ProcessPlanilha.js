import { models } from "../../MongoDB/Schemas/Schemas.js"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import {
  ConvertingDate,
  ConvertingDateAndTime,
  Medicamentos, 
  Materiais,
  ConvertingIdade
} from '../utils/Functions/Converting.js'
import xlsx from 'xlsx'
import mongoose from 'mongoose'
import { BulkMessageQueueWarn } from "./Queues.js"

export const ProcessPlanilha = async (body, params, file, filename) => {

    const { AreadeAtuacao } = body
 
    const { id } = params 
    file
  
    if(AreadeAtuacao){
  
      const UnidadedeSaude = await models.ModelRegisterUnidadeSaude.findById(id)
    
      const NameUnidade = UnidadedeSaude.nomeInstituicao
  
      if(UnidadedeSaude){
  
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDir = dirname(currentFilePath)
        
        const filePath = join(currentDir, '../..', 'planilhas', filename)
        const workbook = xlsx.readFile(filePath)
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonArray = xlsx.utils.sheet_to_json(worksheet)
  
        const  QueryCasosClinicos = jsonArray.map((data) => ({
          Data: data
        }))  

         await models.ModelRegisterUnidadeSaude.findByIdAndUpdate(
          id,
          {
            $push: {
              'HistoricoQuantidadeCasosClinicos': 
              { QuantidadeCasosClinicos: QueryCasosClinicos.length }
            }
          }
        );
        
        const DataPatients = jsonArray.map((data) => ({
          Telefone: data.Telefone,
          NomePaciente: data['Nome-do-Paciente'],
          Especialidade: data['Especialidade'],
          Email: data['Email'],
        }))
        
        await BulkMessageQueueWarn.add('BulkMessageWarn', { 
          DataPatients,  
          NomeUnidade: NameUnidade
        })
  
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
                  Data: /*ConvertingDateAndTime*/(data, 'Validação-Data-Hora'),
                }
                const update = {
                  $setOnInsert: {
                    NomePaciente: data['Nome-do-Paciente'],
                    DataNascimento: ConvertingDate(data, 'Data-de-Nascimento'),
                    Sexo: data['Sexo'],
                    EstadoCivil: data['Estado-Civil'],
                    Profissão: data['Profissão'],
                    Idade: ConvertingIdade(data, 'Data-de-Nascimento'),
                    TipoSanguineo: data['Tipo-Sanguineo'],
                    Email: data['Email'],
                    Telefone: data['Telefone'],
                    FotoUnidadeResponsavel: UnidadedeSaude.Foto,
                    NomeUnidadeResponsavel: UnidadedeSaude.nomeInstituicao
                  },
                  $addToSet: { 'Historico': HistoricoData }
                }
  
                const ObjectCPFAndDoencas = {
                  CPF: data['CPF'],
                  Doenca: data['Procedimento-Doença'],
                  NomePaciente: data['Nome-do-Paciente'],
                  Email: data['Email'],
                  Telefone: data.Telefone,
                  QuantidadeCasosClinicos: QueryCasosClinicos.length,
                  IdentificadorConsulta: new mongoose.Types.ObjectId(),
                }
  
                ObjectData.push(ObjectCPFAndDoencas)
  
                const filter = { 'CPF': data['CPF'] }
                const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            
                const existingPaciente = await models.ModelCasosClinicos.findOneAndUpdate(filter, update, options)
          
                return {
                  existingPaciente
                };
              })
              await Promise.all(pacientes)

              return ObjectData
                
            }else{
              return { error: 'Area de Atuaçao escolhida é imcompativel com a da planilha escolhida abaixo' }
            } 
          }
      
       }else{
        return { error: 'Unidade de Saude nao esta Cadastrada no Interconsulta'}
       }
}