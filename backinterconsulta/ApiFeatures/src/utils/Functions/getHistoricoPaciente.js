import { parse } from 'date-fns'

export const getHistoricoPaciente = async (Paciente, ModelPacientee, res) => {
  const Pacientee = Paciente;

  const updatedPacientee = await ModelPacientee.findById(Pacientee._id);

  const HistoricoCasosClinicosAtualizados = updatedPacientee.Historico.sort((a, b) =>
    parse(a.DataInsercao, 'dd/MM/yyyy', new Date()) - parse(b.DataInsercao, 'dd/MM/yyyy', new Date())
  );

  return res.status(200).json({ HistoricoCasosClinicosAtualizados, Pacientee: updatedPacientee });
};
