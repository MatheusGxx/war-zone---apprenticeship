import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

export const Laudo = (doc,
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
    ) => {

    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDir = dirname(currentFilePath)
    const Logo = join(currentDir, '../../..', 'icons', 'logo.png')
    const Logo2 = join(currentDir, '../../..', 'icons', 'Logo2.png')
  
    doc.image(Logo2, 20, 20, { width: 150 })  

    doc.fontSize(20)

    doc.text('Prontuario Médico do Interconsulta - GID', { align: 'center' });

    doc.moveDown()

    doc.fontSize(10). fillColor('black')

    doc.text(`Data : ${DataAtual}`)

    doc.moveDown()

    doc.text(`Eu, ${NomeMedico}, ${EspecialideMedico}, inscrito no CRM: ${UFMedico} - ${CRMMedico}/RQE: ${RQEMedico}, sendo responsável pelo acompanhamento médico do(a) Paciente ${NomePaciente}, venho por meio deste relatório, com base em exames clínicos e diagnósticos realizados, fornecer informações detalhadas sobre o estado de saúde do paciente e o tratamento prescrito.`)

    doc.moveDown()

    doc.font('Helvetica-Bold')
    .fontSize(11)
    .text('Identificação do Paciente:')

    doc.moveDown()

    doc.font('Helvetica').fontSize(10)
    
    doc.text(`Prontuário: ${Prontuario}`)
    doc.text(`Nome: ${NomePaciente}`)
    doc.text(`Data de Nascimento: ${DataNascimentoPaciente}`)
    doc.text(`Sexo: ${SexoPaciente}`)
    doc.text(`CPF: ${CPFPaciente}`)
    doc.text(`Estado Civil: ${EstadoCivilPaciente}`)
    doc.text(`Profissão: ${ProfissãoPaciente}`)
    doc.text(`Estado: ${EstadoPaciente}`)
    doc.text(`Cidade: ${CidadePaciente}`)
    doc.text(`Bairro: ${BairroPaciente}`)
    doc.text(`Rua: ${RuaPaciente}`) 
    doc.text(`Contato: ${ContatoPaciente}`)

    doc.moveDown()

    doc.font('Helvetica-Bold')
    .fontSize(11)
    .text('Diagnóstico:')

    doc.moveDown()
    
    doc.font('Helvetica').fontSize(10).text(`${DiagnósticoPaciente}`)

    doc.moveDown()
    
    doc.font('Helvetica-Bold')
    .fontSize(11)
    .text('Tratamento Prescrito')

    doc.moveDown()

    doc.font('Helvetica').fontSize(10).text(`${TratamentoPaciente}`)

    doc.moveDown()

    doc.font('Helvetica-Bold')
    .fontSize(11)
    .text('Medicação prescrita')

    doc.moveDown()

    doc.font('Helvetica').fontSize(10).text(`${MedicaçãoPaciente}`)

    doc.moveDown()

    doc.font('Helvetica-Bold')
    .fontSize(11)
    .text('Ferramenta Terapeutica')

    doc.moveDown()

    doc.font('Helvetica').fontSize(10).text(`${FerramentaTerapeuticaPaciente}`)

    doc.moveDown()

    doc.font('Helvetica-Bold')
    .fontSize(11)
    .text('Progresso do Paciente')

    doc.moveDown()

    doc.font('Helvetica').fontSize(10).text(`${ProgressoPaciente}`)

    doc.moveDown()

    doc.font('Helvetica-Bold')
    .fontSize(11)
    .text('Recomendaçoes Futuras')

    doc.moveDown()

    doc.font('Helvetica').fontSize(10).text(`${RecomendaçoesFuturasPaciente}`)

    doc.moveDown()
    doc.moveDown()
    doc.moveDown()
    doc.moveDown()

    const xDataDoctor = 50
    const yDataDoctor = doc.page.height - 150

    doc.text(`${NomeMedico}`, xDataDoctor, yDataDoctor)
    doc.moveDown(0.2)
    doc.text(`CRM: ${UFMedico}-${CRMMedico}`)
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
