import PDFDocument from 'pdfkit'
import { ReceitaControlada } from './ReceitaControlada.js'
import { Atestado } from './Atestado.js'
import { Exames } from './Exame.js'
import { ReceitaSimples } from './ReceitaSimples.js'
import { Laudo } from './Laudo.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import fs from 'fs'

export const CreateLaudo = async (
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
      return new Promise((resolve, reject) => {

          const doc = new PDFDocument({ size: 'A4' })

          const currentFilePath = fileURLToPath(import.meta.url)
          const currentDir = dirname(currentFilePath)
          const CreatedDocumentLaudo = join(currentDir, '../../..', 'pdfs', `Laudo_${NomePaciente.replace(/ /g, '_')}_${DataAtual.replace(/\//g, '-')}.pdf`);
          const outputStream = fs.createWriteStream(CreatedDocumentLaudo)
          const NomeArquivo = `Laudo_${NomePaciente.replace(/ /g, '_')}_${DataAtual.replace(/\//g, '-')}.pdf`

          doc.pipe(outputStream)

          Laudo(doc,
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
          )

          doc.end()

          outputStream.on('finish', () => {
              console.log('Laudo Gerado com sucesso')
              resolve(NomeArquivo)
          })

          outputStream.on('error', (error) => {
              reject(error);
          })
      })
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

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({ size: 'A4' })

    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDir = dirname(currentFilePath)
    const CreatedDocumentReceitaSimples = join(currentDir, '../../..', 'pdfs', `ReceitaSimples_Paciente_${NomePaciente.replace(/ /g, '_')}_${date.replace(/\//g, '-')}_${index}.pdf`);
    const outputStream = fs.createWriteStream(CreatedDocumentReceitaSimples)
    const NomeArquivo = `ReceitaSimples_Paciente_${NomePaciente.replace(/ /g, '_')}_${date.replace(/\//g, '-')}_${index}.pdf`

    doc.pipe(outputStream)
      
    ReceitaSimples(doc, 
      NomePaciente, 
      CPFPaciente, 
      ReceitaSimplesMedico, 
      NomeMedico,
      UFMedico, 
      CRM, 
      EndereçoMedico)
    
    doc.end()

    outputStream.on('finish', () => {
      console.log(`Receita Simples_${index} gerada com Sucesso`)
      resolve(NomeArquivo)
    })

    outputStream.on('error', (error) => {
      reject(error);
    });
  })

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
   index) =>
  { 
    
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4' })
  
      const currentFilePath = fileURLToPath(import.meta.url)
      const currentDir = dirname(currentFilePath)
      const CreatedDocumentReceitaControlada = join(currentDir, '../../..', 'pdfs', `ReceitaControlada_${nomePaciente.replace(/ /g, '_')}_${DataAtual.replace(/\//g, '-')}_${index}.pdf`);
      const outputStream = fs.createWriteStream(CreatedDocumentReceitaControlada)
      const NomeArquivo = `ReceitaControlada_${nomePaciente.replace(/ /g, '_')}_${DataAtual.replace(/\//g, '-')}_${index}.pdf`

      doc.pipe(outputStream)

      ReceitaControlada(doc, NomeMedico, CRM, EndereçoMedico, CidadeMedico, EstadoMedico, UF, DataAtual, nomePaciente, CPFPaciente, EnderecoPaciente, ReceitaControladaD)
    
      doc.end()

      outputStream.on('finish', () => {
        console.log(`Receita Controlada_${index} Gerada com sucesso`)
        resolve(NomeArquivo)
      })
      outputStream.on('error', (error) => {
        reject(error);
      });
    })
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
  index) => {

    return new Promise((resolve, reject) => {

      const doc = new PDFDocument({ size: 'A4' })
    
      const currentFilePath = fileURLToPath(import.meta.url)
      const currentDir = dirname(currentFilePath)
      const CreatedDocumentAtestado = join(currentDir, '../../..', 'pdfs', `Atestado_${NomePaciente.replace(/ /g, '_')}_${DataAtual.replace(/\//g, '-')}_${index}.pdf`);
      const outputStream = fs.createWriteStream(CreatedDocumentAtestado)
      const NomeArquivo = `Atestado_${NomePaciente.replace(/ /g, '_')}_${DataAtual.replace(/\//g, '-')}_${index}.pdf`

      doc.pipe(outputStream)

      Atestado(doc, NomeMedico, CRMMedico, UFMedico, NomePaciente,  CPFPaciente, diasAfastamento, CID, CidadeMedico, EndereçoMedico, DataAtual)

      doc.end()
      
      outputStream.on('finish', () => {
        console.log(`Atestado_${index} gerado com sucesso`)
        resolve(NomeArquivo)
      })
      outputStream.on('error', (error) => {
        reject(error);
      });
    })

}


export const CreateExame = (NomePaciente, ExamesMedico, NomeMedico, CRM, UFMedico, EndereçoMedico, index, date) => {

  return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4' })

      const currentFilePath = fileURLToPath(import.meta.url)
      const currentDir = dirname(currentFilePath)
      const CreatedDocumentExame = join(currentDir, '../../..', 'pdfs', `Exame_${NomePaciente.replace(/ /g, '_')}_${date.replace(/\//g, '-')}_${index}.pdf`);
      const outputStream = fs.createWriteStream(CreatedDocumentExame)
      const NomeArquivo = `Exame_${NomePaciente.replace(/ /g, '_')}_${date.replace(/\//g, '-')}_${index}.pdf`

      doc.pipe(outputStream);

      Exames(doc, NomePaciente, ExamesMedico, NomeMedico, CRM, UFMedico, EndereçoMedico);

      doc.end();
       
      outputStream.on('finish', () => {
        console.log(`Exame_${index} gerado com sucesso`)
        resolve(NomeArquivo)
      })
      outputStream.on('error', (error) => {
          reject(error);
      })
  })
}