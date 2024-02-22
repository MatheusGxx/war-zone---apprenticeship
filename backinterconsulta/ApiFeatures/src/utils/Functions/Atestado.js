import { fileURLToPath } from 'url';
import { dirname, join } from 'path'


export const Atestado = (
    doc, 
    NomeMedico, 
    CRMMedico,
    UFMedico,
    NomePaciente, 
    CPFPaciente, 
    diasAfastamento,
    CID, 
    CidadeMedico, 
    EndereçoMedico,
    DataAtual) => {

    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDir = dirname(currentFilePath)
    const Logo = join(currentDir, '../../..', 'icons', 'logo.png')
    const Logo2 = join(currentDir, '../../..', 'icons', 'Logo2.png')

    doc.image(Logo2, 20, 20, { width: 150 })  

    doc.fontSize(20).text('Atestado do Interconsulta - GID', { align: 'center' });
  
    doc.moveDown()

    doc.fontSize(12)


    doc.text(`Eu ${NomeMedico}, CRM: ${UFMedico}-${CRMMedico}, Atesto para os devidos fins que o(a) paciente ${NomePaciente}, portador(a) do CPF: ${CPFPaciente}, necessita de afastamento de suas atividades laborais pelo periodo de ${diasAfastamento} dias, a contar desta data, por motivo de saúde`, { continue: true })
    doc.moveDown()
    doc.moveDown()

    doc.text(`CID-10: ${CID}`)
    doc.moveDown()
    doc.moveDown()
    doc.text(`Local e Data: ${CidadeMedico}, ${DataAtual}`)

    doc.moveDown()
    doc.moveDown()

    const xDataDoctor = 50
    const yDataDoctor = doc.page.height - 200

    doc.text(`${NomeMedico}`, xDataDoctor, yDataDoctor)
    doc.moveDown(0.2)
    doc.text(`CRM: ${UFMedico}-${CRMMedico}`)
    doc.moveDown(0.2)
    doc.text(`${EndereçoMedico}`)


    const x = 250;
    const y = doc.page.height - 50;
    const yImage = doc.page.height - 62;
    const XImage = 200;
  
    doc.image(Logo, XImage, yImage, { width: 30, lineBreak: false });
  
    doc.font('Helvetica-Bold').fillColor('blue').text('Interconsulta GID', x, y, { lineBreak: false });
  
    doc.link(x, y, 200, 20, 'https://interconsulta.org');

}