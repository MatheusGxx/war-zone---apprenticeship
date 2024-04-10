import { 
    Content, 
    CustomData, 
    DeliveryCategory, 
    EventRequest, 
    UserData, 
    ServerEvent,
} 
from 'facebook-nodejs-business-sdk'

export const ConversionViewContent = async (nameConversion, req, pathname, acessTokenConversionFacebook, pixelIDFacebook) => {
    try{
         
        const current_timestamp = Math.floor(new Date() / 1000)
        
        const userData = new UserData() 
        .setClientIpAddress(req.connection.remoteAddress)
        .setClientUserAgent(req.headers['user-agent'])

        const serverEvent = new ServerEvent()
            .setEventName(nameConversion) // Nome da Conversão
            .setEventTime(current_timestamp)
            .setUserData(userData)
            .setEventSourceUrl(`https://interconsulta.org${pathname}`)
            .setActionSource('website')

        const eventsData = [serverEvent]

        const eventRequest = new EventRequest(acessTokenConversionFacebook, pixelIDFacebook)
            .setEvents(eventsData)

            eventRequest.execute().then(
                response => {
                    console.log(`Conversion Event ${nameConversion} Success:`, response)
                },
                err => {
                    console.error('Error: ', err)
                }
            )
    }catch(err){
      console.log(err)
    }
}

export const ConversionPurchase = (
    nameConversion,
    email, 
    telephone, 
    req, 
    valueConsultation, 
    pathname, 
    acessTokenConversionFacebook, 
    pixelIDFacebook
 ) => {
   try{

    const current_timestamp = Math.floor(new Date() / 1000)

    const userData = new UserData() // Dados do Usuario
      .setEmails([email])
      .setPhones([telephone])
      .setClientIpAddress(req.connection.remoteAddress)
      .setClientUserAgent(req.headers['user-agent'])

   const content = (new Content())
      .setId('funil-de-compra') // Identificador Unico da conversão
      .setQuantity(1)
      .setDeliveryCategory(DeliveryCategory.ONLINE_CONSULTATION)

   const customData = new CustomData() // Moeda do Pais e Valor Pago
      .setContents([content])
      .setCurrency('BRL') 
      .setValue(valueConsultation)

   const serverEvent = new ServerEvent()
      .setEventName(nameConversion) // Nome da Conversão
      .setEventTime(current_timestamp)
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(`https://interconsulta.org${pathname}`)
      .setActionSource('website')

   const eventsData = [serverEvent]

   const eventRequest = new EventRequest(acessTokenConversionFacebook, pixelIDFacebook)
      .setEvents(eventsData)

  eventRequest.execute().then(
    response => {
        console.log(`Conversion Event ${nameConversion} Success:`, response)
    },
    err => {
        console.error('Error: ', err)
    }
)
    
   }catch(err){
    console.log(err)
   }
}

export const ConversionMultiples = (nameConversion, email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook) => {
    try{
        const current_timestamp = Math.floor(new Date() / 1000)

        const userData = new UserData() // Dados do Usuario
          .setEmails([email])
          .setPhones([telephone])
          .setClientIpAddress(req.connection.remoteAddress)
          .setClientUserAgent(req.headers['user-agent'])
  
       const content = (new Content())
          .setId('funil-de-aquisição') // Identificador Unico da conversão
  
       const customData = new CustomData() // Moeda do Pais e Valor Pago
          .setContents([content])
  
       const serverEvent = new ServerEvent()
          .setEventName(nameConversion) // Nome da Conversão
          .setEventTime(current_timestamp)
          .setUserData(userData)
          .setCustomData(customData)
          .setEventSourceUrl(`https://interconsulta.org${pathname}`)
          .setActionSource('website')
  
       const eventsData = [serverEvent]
  
       const eventRequest = new EventRequest(acessTokenConversionFacebook, pixelIDFacebook)
          .setEvents(eventsData)
  
          eventRequest.execute().then(
              response => {
                console.log(`Conversion Event ${nameConversion} Success:`, response)
            },
              err => {
                  console.error('Error: ', err)
              }
          )
    }catch(err){
     console.log(err)
    }
}