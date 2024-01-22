import { models } from '../../../MongoDB/Schemas/Schemas.js'
import { GPT } from "./IA.js"

export const ResumoCasoClinico = async (
    Diagnostico,
    Tratamento,
    Medicacao,
    FerramentasTerapeuticas,
    Progresso,
    SolicitacaoMedicamentos,
    SolicitacaoMateriais,
    SolicitacaoExames,
    RecomendacoesFuturas,
    EstadoPaciente,
    Solicitacao,
    result,
) => {

    const FraseCasoClinico = await GPT(`
    Resuma em um parágrafo as informações desse caso clínico,
    Diagnóstico: ${Diagnostico},
    Tratamento: ${Tratamento},
    Medicacao: ${Medicacao},
    Ferramentas Terapêuticas: ${FerramentasTerapeuticas},
    Progresso do Paciente: ${Progresso},
    Solicitação dos Medicamentos: ${SolicitacaoMedicamentos},
    Solicitação Materiais: ${SolicitacaoMateriais},
    Solicitação Exames: ${SolicitacaoExames},
    Recomendações Futuras: ${RecomendacoesFuturas},
    Estado do Paciente: ${EstadoPaciente},
    Solicitação: ${Solicitacao}
  `);

  const ResumoCasoClinico = FraseCasoClinico.content
  console.log(`Resumo do Caso Clinico: ${ResumoCasoClinico}`)

  const idHistorico = result.Historico[result.Historico.length - 1]._id;

  if (ResumoCasoClinico) {
    await models.ModelRegisterPaciente.findOneAndUpdate(
      { 'Historico._id': idHistorico },
      {
        $set: {
          'Historico.$.ResumoCasoClinico': ResumoCasoClinico,
        },
      },
      {
        new: true,
      }
    );
  }
}