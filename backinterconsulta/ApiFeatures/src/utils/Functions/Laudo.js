import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import PDFDocument from 'pdfkit';

export const Laudo = (
  doc: PDFDocument,
  DataAtual: Date,
  NomeMedico: string,
  EspecialideMedico: string,
  UFMedico: string,
  CRMMedico: string,
  RQEMedico: string,
  NomePaciente: string,
  Prontuario: string,
  DataNascimentoPaciente: Date,
  SexoPaciente: string,
  CPFPaciente: string,
  EstadoCivilPaciente: string,
  ProfissãoPaciente: string,
  EstadoPaciente: string,
  CidadePaciente: string,
  BairroPaciente: string,
  RuaPaciente: string,
  ContatoPaciente: string,
  DiagnósticoPaciente: string,
  TratamentoPaciente: string,
  MedicaçãoPaciente: string,
  FerramentaTerapeuticaPaciente: string,
  ProgressoPaciente: string,
  RecomendaçoesFuturasPaciente: string,
  FichaPaciente: string,
  EndereçoMedico: string
) => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFilePath);
  const Logo = join(currentDir, '../../..', 'icons', 'logo.png');
  const Logo2 = join(currentDir, '../../..', 'icons', 'Logo2.png');

  const addLogo = (page: PDFDocument) => {
    page.image(Logo2, 20, 20, { width: 150 });
  };

  const addPageContent = (page: PDFDocument) => {
    page.fontSize(20);
    page.text('Prontuario Médico do Interconsulta - GID', { align: 'center' });
    page.moveDown();
    page.fontSize(10).fillColor('black');
    page.text(`Data : ${DataAtual}`);
    page.moveDown();
    page.text(
      `Eu, ${NomeMedico}, ${EspecialideMedico}, inscrito no CRM: ${UFMedico} - ${CRMMedico}/RQE: ${RQEMedico}, sendo responsável pelo acompanhamento médico do(a) Paciente ${NomePaciente}, venho por meio deste relatório, com base em exames clínicos e diagnósticos realizados, fornecer informações detalhadas sobre o estado de saúde do paciente e o tratamento prescrito.`
    );
    page.moveDown();
    page.font('Helvetica-Bold').fontSize(11).text('Identificação do Paciente:');
    page.moveDown();
    page.font('Helvetica').fontSize(10);
    const table = page.table({ width: 500, heights: 100 });
    table.cell({ colSpan: 2, padding: 5 }, `Prontuário: ${Prontuario}`);
    table.cell(50, `Nome: ${NomePaciente}`);
    table.cell(50, `Data de Nascimento: ${DataNascimentoPaciente}`);
    table.cell(50, `Sexo: ${SexoPaciente}`);
    table.cell(50, `CPF: ${CPFPaciente}`);
    table.cell(50, `Estado Civil: ${EstadoCivilPaciente}`);
    table.cell(50, `Profissão: ${ProfissãoPaciente}`);
    table.cell(50, `Estado: ${EstadoPaciente}`);
    table.cell(50, `Cidade: ${CidadePaciente}`);
    table.cell(50, `Bairro: ${BairroPaciente}`);
    table.cell(50, `Rua: ${RuaPaciente}`);
    table.cell(50, `Contato: ${ContatoPaciente}`);
    table.end();
    page.moveDown();
    page.font('Helvetica-Bold').fontSize(11).text('Diagnóstico:');
    page.moveDown();
    page.font('Helvetica').fontSize(10).text(`${DiagnósticoPaciente}`);
    page.moveDown();
    page.font('Helvetica-Bold').fontSize(11).text('Tratamento Prescrito');
    page.moveDown();
    page.font('Helvetica').fontSize(10).text(`${TratamentoPaciente}`);
    page.moveDown();
    page.font('Helvetica-Bold').fontSize(11).text('Medicação prescrita');
    page.moveDown();
    page.font('Helvetica').fontSize(10).text(`${MedicaçãoPaciente}`);
    page.moveDown();
    page.font('Helvetica-Bold').fontSize(11).text('Ferramenta Terapeutica');
    page.moveDown();
    page.font('Helvetica').fontSize(10).text(`${FerramentaTerapeuticaPaciente}`);
    page.moveDown();
    page.font('Helvetica-Bold').fontSize(11).text
