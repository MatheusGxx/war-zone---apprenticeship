import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

export const ReceitaControlada = (doc, NomeMedico, CRM, EndereçoMedico, CidadeMedico, EstadoMedico, UF, DataAtual, nomePaciente, CPFPaciente, EnderecoPaciente, ReceitaControladaD) => {
  
    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDir = dirname(currentFilePath)
    const Logo = join(currentDir, '../../..', 'icons', 'logo.png')
    const Logo2 = join(currentDir, '../../..', 'icons', 'Logo2.png')

    doc.image(Logo2, 20, 20, { width: 150 })  

    doc.fontSize(20).text('Receita Controlada do Interconsulta - GID', { align: 'center' });
  
    doc.moveDown(); // Move para baixo o cursor de escrita 
  
    doc.fontSize(12)
  
    doc.moveDown();
  
    const XEmitente = 40;
    const YEmitente = doc.page.height - 700
  
    // Adiciona identificação do Emitente
    doc.rect(XEmitente - 20, YEmitente - 20, 250, 130)
      .lineWidth(1)
      .strokeColor('blue')
      .stroke();
  
    doc.font('Helvetica-Bold').text('Identificação do Emitente', XEmitente, YEmitente);
    doc.moveDown();
    doc.font('Helvetica').text(`Nome: ${NomeMedico}`);
    doc.moveDown(0.3);
    doc.text(`CRM: ${UF}-${CRM}`);
    doc.moveDown(0.3);
    doc.text(`Endereço: ${EndereçoMedico}`);
    doc.moveDown(0.3);
    doc.text(`Cidade e UF: ${CidadeMedico} - ${EstadoMedico}`);
  
    doc.moveDown()
  
    const XReceituarioReceituarioEspecial = 330;
    const YReceituarioEspecial = doc.page.height - 700
  
    // Adiciona o Receituário Controle Especial
    doc.font('Helvetica-Bold').text('Receituário Controle Especial', XReceituarioReceituarioEspecial + 5, YReceituarioEspecial + 5);
    doc.moveDown(0.3);
    doc.font('Helvetica').text(`Data: ${DataAtual}`);
    doc.moveDown(0.3);
    doc.text('1a. via Farmácia');
    doc.moveDown(0.3);
    doc.text('2a. via Paciente');
  
    const xInicio = 330;
    const yInicio = doc.page.height - 600;
    const xFim = XReceituarioReceituarioEspecial + 200;
    const yFim = yInicio;
  
    doc.moveTo(xInicio, yInicio)
      .lineTo(xFim, yFim)
      .lineWidth(1)
      .strokeColor('blue')
      .stroke();
  
    doc.moveDown();

    
    const XD = 40;
    const YD = doc.page.height - 500

    doc.text(`Nome do Paciente: ${nomePaciente}`, XD, YD)
    doc.moveDown()
    doc.text(`CPF do Paciente: ${CPFPaciente}`)
    doc.moveDown()
    doc.text(`Endereço do Paciente: ${EnderecoPaciente}`)
    doc.moveDown()
    doc.text(`${ReceitaControladaD}`)
  
    const XComprador = 40;
    const YComprador = doc.page.height - 200;
  
    // Adiciona identificação do Comprador
    doc.rect(XComprador - 20, YComprador - 20, 250, 130)
      .lineWidth(1)
      .strokeColor('blue')
      .stroke();
  
    doc.font('Helvetica-Bold').text('Identificação do Comprador', XComprador, YComprador);
    doc.moveDown();
    doc.font('Helvetica').text('Nome:');
    doc.text('RG:');
    doc.text('Endereço:');
    doc.text('Cidade e UF:');
  
    doc.moveDown();
  
    const XFornecedor = 330;
    const YFornecedor = doc.page.height - 200;
  
    // Adiciona identificação do Fornecedor
    doc.rect(XFornecedor - 20, YFornecedor - 20, 250, 130)
      .lineWidth(1)
      .strokeColor('blue')
      .stroke();
  
    doc.font('Helvetica-Bold').text('Identificação do Fornecedor', XFornecedor, YFornecedor);
    doc.moveDown();
    doc.font('Helvetica').text('Data:')
    doc.text('Assinatura do Farmacêutico:')
  
    const x = 250;
    const y = doc.page.height - 50;
    const yImage = doc.page.height - 62;
    const XImage = 200;
  
    doc.image(Logo, XImage, yImage, { width: 30, lineBreak: false });
  
    doc.font('Helvetica-Bold').fillColor('blue').text('Interconsulta GID', x, y, { lineBreak: false });
  
    doc.link(x, y, 200, 20, 'https://interconsulta.org');

    
  }