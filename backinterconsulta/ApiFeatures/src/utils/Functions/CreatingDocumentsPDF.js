import PDFDocument from 'pdfkit'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import { ReceitaControlada } from './ReceitaControlada.js'
import { Atestado } from './Atestado.js'
import { Exames } from './Exame.js'
import fs from 'fs'

const doc = new PDFDocument({ size: 'A4' })

export const CreateLaudo = async (text) => {

  const chunks = []

  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFilePath)

  const logoPath = join(currentDir, '../../..', 'icons', 'Logo2.png')

  doc.image(logoPath, 50, 50, { width: 200 })

  doc.fontSize(20).fillColor('blue')

  const Titulo = 'Prontuario Médico do Interconsulta';
  const titleWidth = doc.widthOfString(Titulo);

  const centerX = (doc.page.width - titleWidth) / 2

  const titleY = 130

  doc.text(Titulo, centerX, titleY); 

  doc.fontSize(12). fillColor('black');

  doc.text(text, 100, 200);

  doc.on('data', (chunk) => {
    chunks.push(chunk)
  })

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    })

    doc.on('error', reject);

    doc.end()
  })
}

export const CreateReceitaSimples = () => {

  // Crie um arquivo de saída para o PDF
  const outputStream = fs.createWriteStream('ReceitaSimples.pdf');
  
  // Inicie a gravação do PDF no arquivo de saída
  doc.pipe(outputStream)

  const currentFilePath = fileURLToPath(import.meta.url)
  const currentDir = dirname(currentFilePath)
  const Logo = join(currentDir, '../../..', 'icons', 'logo.png')
  const Logo2 = join(currentDir, '../../..', 'icons', 'Logo2.png')

  doc.image(Logo2, 20, 20, { width: 150 })  

  doc.fillColor('black')

  doc.fontSize(20).text('Receituario Simples', { align: 'center'})

  doc.moveDown()

  doc.fontSize(12)

  doc.font('Helvetica-Bold')
  .fontSize(12)
  .text('Nome:', { continued: true })
  .font('Helvetica')
  .text(' Matheus Galtaroça')
    
  doc.moveDown(1) // Altere o valor conforme necessário para ajustar o espaçamento

  doc.font('Helvetica-Bold')
  .fontSize(12)
  .text('CPF:', { continued: true })
  .font('Helvetica')
  .text(' 52885473860')

  doc.moveDown(3) // Altere o valor conforme necessário para ajustar o espaçamento

  const x = 250
  const y = doc.page.height - 50
  const yImage = doc.page.height - 62
  const XImage = 200


  doc.image(Logo, XImage, yImage, {  width: 30 ,lineBreak: false })

  doc.font('Helvetica-Bold').fillColor('blue').text('Interconsulta GID', x, y, { lineBreak: false })
  
  doc.link(x, y, 200, 20, 'https://interconsulta.org')

  doc.end()

  outputStream.on('finish', () => {
    console.log('Receita Simples criada com sucesso!')
  })

}

export const CreateReceitaControlada = (NomeMedico, CRM, EndereçoMedico, CidadeMedico, UF, DataAtual) =>
  {
    
    const outputStream = fs.createWriteStream('ReceitaControlada.pdf');
    doc.pipe(outputStream)

    ReceitaControlada(doc, NomeMedico, CRM, EndereçoMedico, CidadeMedico, UF, DataAtual)

    // Clona a página
    doc.addPage()
  
    // Adiciona novamente o conteúdo da página original
    ReceitaControlada(doc, NomeMedico, CRM, EndereçoMedico, CidadeMedico, UF, DataAtual)
  
    doc.end()

    outputStream.on('finish', () => {
      console.log('Receita Controlada Criada com Sucesso');
    });
}



export const CreateAtestado = (  NomeMedico, 
  CRMMedico,
  NomePaciente, 
  CPFPaciente, 
  diasAfastamento,
  CID, 
  CidadeMedico, 
  DataAtual) => {

   const outputStream = fs.createWriteStream('Atestado.pdf')
   doc.pipe(outputStream)

   Atestado(doc, NomeMedico, CRMMedico, NomePaciente,  CPFPaciente, diasAfastamento, CID, CidadeMedico, DataAtual)

   doc.end()

   outputStream.on('finish', () => {
    console.log('Atestado Gerado com Sucesso')
   })

}


export const CreateExame = () => {
  
  const outputStream = fs.createWriteStream('Exame.pdf')
  doc.pipe(outputStream)

  Exames(doc)

  doc.end()

  outputStream.on('finish', () => {
    console.log('Exame Gerado com Sucesso')
   })
   
}