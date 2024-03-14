import { models } from "../../MongoDB/Schemas/Schemas"

export const TrackingUTM = async (
    id,
    data,
    UTM_Referrer,
    UTM_Funil,
    UTM_Temp,
    UTM_Rota,
    UTM_Source,
    UTM_Medium,
    UTM_Campaign,
    UTM_Term,
    UTM_Content
  ) => {
    try {
      const updatedDoc = await models.ModelRegisterPaciente.findOneAndUpdate(
        { id: id },
        {
          $push: {
            TrackingUTM: {
              data: data,
              UTM_Referrer: UTM_Referrer,
              UTM_Funil: UTM_Funil,
              UTM_Temp: UTM_Temp,
              UTM_Rota: UTM_Rota,
              UTM_Source: UTM_Source,
              UTM_Medium: UTM_Medium,
              UTM_Campaign: UTM_Campaign,
              UTM_Term: UTM_Term,
              UTM_Content: UTM_Content,
            },
          },
        },
        { new: true }
      );
  
      if (!updatedDoc) {
        return res.status(404).json({ message: 'Documento não encontrado' });
      }
  
      return res.status(200).json({ message: 'UTM Tracking feito com Sucesso'});
    } catch (err) {
      return res.status(400).json({ message: 'Erro ao atualizar o UTM Tracking', error: err });
    }
  };
  