import { models } from "../../MongoDB/Schemas/Schemas.js"
import { FacebookAdsApi, Content, CustomData, DeliveryCategory, EventRequest, UserData, ServerEvent } from 'facebook-nodejs-business-sdk';

const acessToken = 'EAAUiJgbgiB0BO6W0xRXkeg5hWpUejQ2fpyh1FkADIf2BZANjmkCnYnYrKU12cdSJBfcxjlfIa9IIR6N5MEPJddUwvZBkG5mjFsFwPIqN0amX97X3l9k9J5QCe7IfLmE6l0wCrPhlxYSOVP8lVwSzgrS4MneW5dsZBCngRhCmzfsVFlCjwcmIJp1ObCAdx5tBQZDZD'
const pixelID = '2228702834001265'
FacebookAdsApi.init(acessToken)

export const TrackingUTMAQ = async (
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
    UTM_Content,
    res
  ) => {
    try {
      const updatedDoc = await models.ModelRegisterPaciente.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            TrackingUTMAQ: {
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
  
      return res.status(200).json({ message: 'Tracking de UTM de Aquisição feito com sucesso!'});
    } catch (err) {
      return res.status(400).json({ message: 'Erro ao atualizar o Tracking de UTM de Aquisição' });
    }
}

export const TrackingUTMCS = async (
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
  UTM_Content,
  res
) => {
  try {
    const updatedDoc = await models.ModelRegisterPaciente.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          TrackingUTMCS: {
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

    return res.status(200).json({ message: 'Tracking de UTM de Conversão feito com Sucesso'});
  } catch (err) {
    return res.status(400).json({ message: 'Erro ao atualizar o Tracking de UTM de Conversão'});
  }
}




export const WarningFacebookConversion = (req,res) => {
  try{
    const current_timestamp = Math.floor(new Date() / 1000)

    const userData = new UserData()
    .setEmails(['matheussoaresfff02@gmail.com'])
    .setPhones(['11983242301'])
    .setClientIpAddress(req.connection.remoteAddress)
    .setClientUserAgent(req.headers['user-agent'])

    const content = (new Content())
    .setId('funil-de-compra') // Identificador Unico da conversão
    .setQuantity(1)
    .setDeliveryCategory(DeliveryCategory.ONLINE_CONSULTATION)

    const customData = new CustomData()
    .setContents([content])
    .setCurrency('BRL') 
    .setValue(123.45)

    const serverEvent = new ServerEvent()
    .setEventName('Purchase') // Nome da Conversão
    .setEventTime(current_timestamp)
    .setUserData(userData)
    .setCustomData(customData)
    .setEventSourceUrl('https://interconsulta.org/especialistas-disponiveis')
    .setActionSource('website');

    const eventsData = [serverEvent]

    const eventRequest = new EventRequest(acessToken, pixelID)
    .setEvents(eventsData);

    eventRequest.execute().then(
        response => {
            console.log('Response: ', response);
        },
        err => {
            console.error('Error: ', err);
        }
    );

  }catch(err){
    return res.status(400).json({ message: 'Erro ao enviar evento de conversão para o Facebook'})
  }
}