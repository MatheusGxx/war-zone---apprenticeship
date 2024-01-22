import PDFDocument from 'pdfkit'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

export const CreatingPDF = async (text) => {
  const doc = new PDFDocument({ size: 'A4' });
  const chunks = []

  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFilePath)

  const logoPath = join(currentDir, '../../..', 'icons', 'Logo2.png')

  doc.image(logoPath, 50, 50, { width: 200 });

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