import dotenv from 'dotenv'
dotenv.config()

import { models } from "../../MongoDB/Schemas/Schemas.js"
import { 
   ViewContent,
   CompleteRegistration, 
   Purchase, 
   Lead, 
   Schedule, 
   InitiateCheckout
} from "../utils/Marketing/Conversions.js"
import { FacebookAdsApi } from 'facebook-nodejs-business-sdk'

const acessTokenConversionFacebook = process.env.acessTokenConversionFacebook
const pixelIDFacebook =  process.env.pixelIDFacebook

FacebookAdsApi.init(acessTokenConversionFacebook)

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


export const WarningFacebookConversion = async (req,res, typeConversion, pathname, valueConsulta, id) => {

  try{

    const Patient = await models.ModelRegisterPaciente.findOne({ _id: id })

     switch(typeConversion){
      case 'View Content':
        ViewContent(req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
        res.status(200).json({ message: 'Conversion View Content Register Success'})
      break

      case 'Purchase':
       Purchase(Patient.email, Patient.telefone, req, valueConsulta, pathname, acessTokenConversionFacebook, pixelIDFacebook)
       res.status(200).json({ message: 'Conversion Purchase Register Success'})

      break

      case 'Lead':
       Lead(Patient.email, Patient.telefone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
       res.status(200).json({ message: 'Conversion Lead Register Success'})

      break

      case 'Initiate Checkout':
       InitiateCheckout(Patient.email, Patient.telefone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
       res.status(200).json({ message: 'Conversion Initiate Checkout Register Success'})

      break
 
      case 'Schedule':
       Schedule(Patient.email, Patient.telefone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
       res.status(200).json({ message: 'Conversion Schedule Register Success'})

      break

      case 'Complete Registration':
       CompleteRegistration(Patient.email, Patient.telefone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
       res.status(200).json({ message: 'Conversion Complete Registration Register Success'})
      break
      default:
        return res.status(404).json({ message: 'TypeConversion Invalid'})

     }

  }catch(err){
    return res.status(400).json({ message: 'Erro ao enviar evento de conversão para o Facebook'})
  }
}

