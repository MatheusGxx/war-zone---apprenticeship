import { ConversionViewContent, ConversionPurchase, ConversionMultiples } from "./ModelsConversions.js"

export const ViewContent = (req, pathname, acessTokenConversionFacebook, pixelIDFacebook) => {
  try{
      ConversionViewContent('ViewContent',req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
  }catch(err){
    console.log(err)
  }
}

export const Purchase = (
    email, 
    telephone, 
    req, 
    valueConsultation, 
    pathname, 
    acessTokenConversionFacebook, 
    pixelIDFacebook
    ) => {
    try{
      
     ConversionPurchase('Purchase',email, telephone, req, valueConsultation, pathname, acessTokenConversionFacebook, pixelIDFacebook)
     
    }catch(err){
      console.log(err)
    }
}


export const Lead = (email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook) => {
    try{
       ConversionMultiples('Lead',email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
    }catch(err){
      console.log(err)
    }
}


export const InitiateCheckout = (email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook) => {
    try{
        ConversionMultiples('InitiateCheckout', email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
    }catch(err){
      console.log(err)
    }
}

export const Schedule = (email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook) => {
    try{
        ConversionMultiples('Schedule', email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook)
    }catch(err){
      console.log(err)
    }
}

export const CompleteRegistration = (email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook) => {
  try{

    ConversionMultiples('CompleteRegistration', email, telephone, req, pathname, acessTokenConversionFacebook, pixelIDFacebook)

  }catch(err){
    console.log(err)
  }  
}


