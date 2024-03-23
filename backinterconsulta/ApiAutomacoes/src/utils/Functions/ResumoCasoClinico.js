import { models } from '../../../MongoDB/Schemas/Schemas.js'
import { GPT } from "./IA.js"

export const ResumoCasoClinico = async (
  FichaPaciente,
  Diagnostico, 
  Tratamento, 
  FerramentasTerapeuticas,
  Progresso,
  SolicitacaoMateriais,
  RecomendacoesFuturas,
  EstadoPaciente,
  ReceitaSimples,
  ReceitaControlada,
  Atestado,
  Exame,
  result,
) => {

    const FraseCasoClinico = await GPT(`
    Resuma em um parágrafo as informações desse caso clínico,
    Ficha do Paciente: ${FichaPaciente}
    Diagnóstico: ${Diagnostico},
    Tratamento: ${Tratamento},
    Ferramentas Terapêuticas: ${FerramentasTerapeuticas},
    Progresso do Paciente: ${Progresso},
    Solicitação Materiais: ${SolicitacaoMateriais},
    Recomendações Futuras: ${RecomendacoesFuturas},
    Estado do Paciente: ${EstadoPaciente},
    Receitas Simples Solicitadas: ${ReceitaSimples}
    Receita Controlada Solicitadas : ${ReceitaControlada}
    Atestados Solicitados: ${Atestado}
    Exames: ${Exame}
  `);

  const ResumoCasoClinico = FraseCasoClinico.content
  console.log(`Resumo do Caso Clinico: ${ResumoCasoClinico}`)

  const idHistorico = result.Historico[result.Historico.length - 1]._id
  
  if (ResumoCasoClinico) {
    const updateCasoClinico = await models.ModelRegisterPaciente.findOneAndUpdate(
      { 'Historico._id': idHistorico },
      {
        $set: {
          'Historico.$.ResumoCasoClinico': ResumoCasoClinico,
        },
      },
      {
        new: true,
      }
    )
  }
}