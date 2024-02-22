import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

export const ReceitaSimples = (doc, NomePaciente, CPFPaciente, ReceitaSimplesMedico, NomeMedico, UFMedico, CRM, EndereçoMedico) => {
    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDir = dirname(currentFilePath)
    const Logo = join(currentDir, '../../..', 'icons', 'logo.png')
    const Logo2 = join(currentDir, '../../..', 'icons', 'Logo2.png')
  
    doc.image(Logo2, 20, 20, { width: 150 })  
  
    doc.fillColor('black')
  
    doc.fontSize(20).text('Receituario Simples - GID', { align: 'center'})
  
    doc.moveDown()
  
    doc.fontSize(12)
  
    doc.font('Helvetica-Bold')
    .fontSize(12)
    .text('Nome:', { continued: true })
    .font('Helvetica')
    .text(` ${NomePaciente}`)
      
    doc.moveDown(1) // Altere o valor conforme necessário para ajustar o espaçamento
  
    doc.font('Helvetica-Bold')
    .fontSize(12)
    .text('CPF:', { continued: true })
    .font('Helvetica')
    .text(` ${CPFPaciente}`)

    doc.moveDown(1)
  
    doc.text(`${ReceitaSimplesMedico}`)
  
    doc.moveDown(3) // Altere o valor conforme necessário para ajustar o espaçamento

    const xDataDoctor = 50
    const yDataDoctor = doc.page.height - 200

    doc.text(`${NomeMedico}`, xDataDoctor, yDataDoctor)
    doc.moveDown(0.2)
    doc.text(`CRM: ${UFMedico}-${CRM}`)
    doc.moveDown(0.2)
    doc.text(`${EndereçoMedico}`)
  
    const x = 250
    const y = doc.page.height - 50
    const yImage = doc.page.height - 62
    const XImage = 200
  
    doc.image(Logo, XImage, yImage, {  width: 30 ,lineBreak: false })
  
    doc.font('Helvetica-Bold').fillColor('blue').text('Interconsulta GID', x, y, { lineBreak: false })
    
    doc.link(x, y, 200, 20, 'https://interconsulta.org')
  
}