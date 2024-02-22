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
    EndereçoMedico,
    idPaciente
    ) => {


    return new Promise((resolve, reject) => {

      const doc = new PDFDocument({ size: 'A4' })

      const currentFilePath = fileURLToPath(import.meta.url)
      const currentDir = dirname(currentFilePath)
      const CreatedDocumentLaudo = join(currentDir, '../../..', 'pdfs', `Laudo_${NomePaciente}_${DataAtual}.pdf`)
      const outputStream = fs.createWriteStream(CreatedDocumentLaudo)
      const NomeArquivo = `Laudo_${NomePaciente}_${DataAtual}.pdf`


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
        EndereçoMedico,
        )
    
      doc.end()

      outputStream.on('finish', () => {
        console.log('Laudo Gerado com sucesso')
        resolve(NomeArquivo)
      })
    
      outputStream.on('error', (error) => {
        reject('Erro ao criar Laudo', error);
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
    const CreatedDocumentReceitaSimples = join(currentDir, '../../..', 'pdfs', `ReceitaSimples_Paciente_${NomePaciente}_${date}_${index}.pdf`)
    const outputStream = fs.createWriteStream(CreatedDocumentReceitaSimples)
    const NomeArquivo = `ReceitaSimples_Paciente_${NomePaciente}_${date}_${index}.pdf`

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
      reject('Erro ao criar Receita Simples', error);
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
      const CreatedDocumentReceitaControlada = join(currentDir, '../../..', 'pdfs', `ReceitaControlada_${nomePaciente}_${DataAtual}_${index}.pdf`)
      const outputStream = fs.createWriteStream(CreatedDocumentReceitaControlada)
      const NomeArquivo =`ReceitaControlada_${nomePaciente}_${DataAtual}_${index}.pdf`

      doc.pipe(outputStream)

      ReceitaControlada(doc, NomeMedico, CRM, EndereçoMedico, CidadeMedico, EstadoMedico, UF, DataAtual, nomePaciente, CPFPaciente, EnderecoPaciente, ReceitaControladaD)
    
      doc.end()

      outputStream.on('finish', () => {
        console.log(`Receita Controlada_${index} Gerada com sucesso`)
        resolve(NomeArquivo)
      })
      outputStream.on('error', (error) => {
        reject('Erro ao criar Receita Controlada', error);
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
      const CreatedDocumentAtestado = join(currentDir, '../../..', 'pdfs', `Atestado_${NomePaciente}_${DataAtual}_${index}.pdf`)
      const outputStream = fs.createWriteStream(CreatedDocumentAtestado)
      const NomeArquivo = `Atestado_${NomePaciente}_${DataAtual}_${index}.pdf`

      doc.pipe(outputStream)

      Atestado(doc, NomeMedico, CRMMedico, UFMedico, NomePaciente,  CPFPaciente, diasAfastamento, CID, CidadeMedico, EndereçoMedico, DataAtual)

      doc.end()
      
      outputStream.on('finish', () => {
        console.log(`Atestado_${index} gerado com sucesso`)
        resolve(NomeArquivo)
      })
      outputStream.on('error', (error) => {
        reject('Erro ao criar Atestado', error);
      });
    })

}


export const CreateExame = (NomePaciente, ExamesMedico, NomeMedico, CRM, UFMedico, EndereçoMedico, index, date) => {

  return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4' })

      const currentFilePath = fileURLToPath(import.meta.url)
      const currentDir = dirname(currentFilePath)
      const CreatedDocumentExame = join(currentDir, '../../..', 'pdfs', `Exame_${NomePaciente}_${date}_${index}.pdf`)
      const outputStream = fs.createWriteStream(CreatedDocumentExame)
      const NomeArquivo = `Exame_${NomePaciente}_${date}_${index}.pdf`

      doc.pipe(outputStream);

      Exames(doc, NomePaciente, ExamesMedico, NomeMedico, CRM, UFMedico, EndereçoMedico);

      doc.end();
       
      outputStream.on('finish', () => {
        console.log(`Exame_${index} gerado com sucesso`)
        resolve(NomeArquivo)
      })
      outputStream.on('error', (error) => {
          reject('Erro ao gerar Exame', error);
      })
  })
}