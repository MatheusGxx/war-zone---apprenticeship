import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

export const Exames = (doc) => {

    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDir = dirname(currentFilePath)
    const Logo = join(currentDir, '../../..', 'icons', 'logo.png')
    const Logo2 = join(currentDir, '../../..', 'icons', 'Logo2.png')

    doc.image(Logo2, 20, 20, { width: 150 })  

    doc.fontSize(20).text('Solicitação de Exames - Interconsulta GID', { align: 'center' });
  
    doc.moveDown()

    doc.fontSize(12)

    
    const x = 250
    const y = doc.page.height - 50
    const yImage = doc.page.height - 62
    const XImage = 200;
  
    doc.image(Logo, XImage, yImage, { width: 30, lineBreak: false });
  
    doc.font('Helvetica-Bold').fillColor('blue').text('Interconsulta GID', x, y, { lineBreak: false });
  
    doc.link(x, y, 200, 20, 'https://interconsulta.org');
}