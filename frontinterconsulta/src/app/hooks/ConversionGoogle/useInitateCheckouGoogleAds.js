import { useEffect, useState } from 'react'

export const useInitiateCheckGoogleAds = (nameConversion, eventCategory, LabelEvent, value, router) => {
    const [okConversionGoogle, setOkConversionGoogle] = useState(false)
    
    useEffect(() => {
        setOkConversionGoogle(true)
        if(okConversionGoogle){
            window.gtag && window.gtag('event', nameConversion, {
                'event_category': eventCategory, // Categoria do Evento
                'event_label': LabelEvent, // Nome do Evento ( Label )
                'value': value, // Valor do Evento
                'page_path': router
            })
        }
    },[okConversionGoogle, nameConversion, eventCategory, LabelEvent, value, router])
}