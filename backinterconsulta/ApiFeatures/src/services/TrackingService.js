import { models } from "../../MongoDB/Schemas/Schemas.js"
import { 
  FacebookAdsApi, 
  Content, 
  CustomData, 
  DeliveryCategory, 
  EventRequest, 
  UserData, 
  ServerEvent,
  AdAccount,
  CustomAudience,
} 
from 'facebook-nodejs-business-sdk';

const acessToken = 'EAAFeDRIT1VABO7eOm1StK4jm69FCcWaaWZCEfH020KL6OQGZCOeEkZCts3FH3rGHb3I0Us7VLp38YG3TSmNvvd3NYC5ge1NOoR3mZBADzqZBMRmhjuCjEJI1dWlN7tS2A5ZB0RsnOTHGZBBcN9J1pKikwC2x5FmCZBzyUYBL97MN4ZBmglljDZAjhFQE2rbjdg7esA'
const pixelID = '2228702834001265'
//

const AppID = '384885207586128'
const SecretKey = '6cae87271ea5b55a4c46ac6f6a390e7a'
const AccountID = '966818980974907'

//

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

export const CreateCustomAudience = async (req, res) => {
  try{

    //const customAudience = new CustomAudience(null, AccountID)

    const audienceParams = {
      name: 'Meu Público Personalizado', // Nome do Publico 
      prefill: true, // Rastreia toda a ação do usuario no site antes do momento de criar o publico.
      retention_days: 30, // Numero de dias para manter alguem no publico.
      rule: {
        inclusions: {
          operator: 'or',
          rules: [
            {
              event_sources: [
                {
                  id: pixelID,
                  type: 'pixel'
                }
              ],
              retention_seconds: 8400,
              filter: {
                operator: 'and',
                filters: [
                  {
                    field: 'event',
                    operator: '=',
                    value: 'Purchase' 
                  }                  
                ]
              }
            }
          ]
        }
      }
    }

    const customaudiences = await (new AdAccount(AccountID)).createCustomAudience(
      [],
      audienceParams
    ) 

    console.log(`Publico Personalizado criado com sucesso!`, customaudiences)
  }catch(err){
    console.log(err)
    return res.status(400).json({ message: 'Error in Created Custom Audience'})
  }
}



