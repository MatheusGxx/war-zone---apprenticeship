import PDFDocument from 'pdfkit'
import { ReceitaControlada } from './ReceitaControlada.js'
import { Atestado } from './Atestado.js'
import { Exames } from './Exame.js'
import { ReceitaSimples } from './ReceitaSimples.js'
import { Laudo } from './Laudo.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import fs from 'fs'

const createPDF = async (
  createFunction,
  outputName,
  data,
  fileSuffix = '',
  consoleMessage = ''
) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4' })
    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDir = dirname(currentFilePath)
    const outputFile = join(currentDir, '../../..', 'pdfs', `${outputName}_${data.replace(/\//g, '-')}${fileSuffix}.pdf`)
    const outputStream = fs.createWriteStream(outputFile)

    doc.pipe(outputStream)
    await createFunction(doc, ...data)
    doc.end()

    outputStream.on('finish', () => {
      console.log(consoleMessage)
      resolve(`${outputName}_${data.replace(/\//g, '-')}${fileSuffix}.pdf`)
    })

    outputStream.on('error', (error) => {
      reject(error)
    })
  })
}

export const CreateLaudo = (
  DataAtual,
  NomeMedico,
  EspecialideMedico,
  UFMedico,
  CRMMedico,
  RQEMedico,
  NomePaciente,
  Prontuario,
  DataNascimentoPaciente,
  SexoPaciente,
  CPFPaciente,
  EstadoCivilPaciente,
  ProfissãoPaciente,
  EstadoPaciente,
  CidadePaciente,
  BairroPaciente,
  RuaPaciente,
  ContatoPaciente,
  DiagnósticoPaciente,
  TratamentoPaciente,
  MedicaçãoPaciente,
  FerramentaTerapeuticaPaciente,
  ProgressoPaciente,
  RecomendaçoesFuturasPaciente,
  FichaPaciente,
  EndereçoMedico,
) => {
  return createPDF(
    Laudo,
    `Laudo_${NomePaciente}`,
    [
      DataAtual,
      NomeMedico,
      EspecialideMedico,
      UFMedico,
      CRMMedico,
      RQEMedico,
      NomePaciente,
      Prontuario,
      DataNascimentoPaciente,
      SexoPaciente,
      CPFPaciente,
      EstadoCivilPaciente,
      ProfissãoPaciente,
      EstadoPaciente,
      CidadePaciente,
      BairroPaciente,
      RuaPaciente,
      ContatoPaciente,
      DiagnósticoPaciente,
      TratamentoPaciente,
      MedicaçãoPaciente,
      FerramentaTerapeuticaPaciente,
      ProgressoPaciente,
      RecomendaçoesFuturasPaciente,
      FichaPaciente,
      EndereçoMedico,
    ],
    `_${DataAtual.replace(/\//g, '-')}`,
    'Laudo Gerado com sucesso'
  )
}

export const CreateReceitaSimples = (
  NomePaciente,
  CPFPaciente,
  ReceitaSimplesMedico,
  NomeMedico,
  UFMedico,
  CRM,
  EndereçoMedico,
  index,
  date
) => {
  return createPDF(
    ReceitaSimples,
    `ReceitaSimples_Paciente_${NomePaciente}`,
    [
      NomePaciente,
      CPFPaciente,
      ReceitaSimplesMedico,
      NomeMedico,
      UFMedico,
      CRM,
      EndereçoMedico,
      index,
      date,
    ],
    `_${index}`,
    `Receita Simples_${index} gerada com Sucesso`
  )
}

export const CreateReceitaControlada = (
  NomeMedico,
  CRM,
  EndereçoMedico,
  CidadeMedico,
  EstadoMedico,
  UF,
  DataAtual,
  nomePaciente,
  CPFPaciente,
  EnderecoPaciente,
  ReceitaControladaD,
  index
) => {
  return createPDF(
    ReceitaControlada,
    `ReceitaControlada_${nomePaciente}`,
    [
      NomeMedico,
      CRM,
      EndereçoMedico,
      CidadeMedico,
      EstadoMedico,
      UF,
      DataAtual,
      nomePaciente,
      CPFPaciente,
      EnderecoPaciente,
      ReceitaControladaD,
      index,
    ],
    `_${index}`,
    `Receita Controlada_${index} Gerada com sucesso`
  )
}

export const CreateAtestado = (
  NomeMedico,
  CRMMedico,
  UFMedico,
  NomePaciente,
  CPFPaciente,
  diasAfastamento,
  CID,
  CidadeMedico,
  EndereçoMedico,
  DataAtual,
  index
) => {
  return createPDF(
    Atestado,
    `Atestado_${NomePaciente}`,
   
