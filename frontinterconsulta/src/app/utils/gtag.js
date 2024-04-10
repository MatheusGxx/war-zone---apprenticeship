import { customAlphabet } from 'nanoid'


export const ConversionGoogle = (nameConversion, eventCategory, LabelEvent, value, router) => {
    return window.gtag && window.gtag('event', nameConversion, {
        'event_category': eventCategory, // Categoria do Evento
        'event_label': LabelEvent, // Nome do Evento ( Label )
        'value': value, // Valor do Evento
        'page_path': router
    })
}

export const ConversionGooglePurchase = (
    nameConversion, 
    eventCategory, 
    LabelEvent, 
    value, 
    router,
    nomeMedico) => {

    const numericAlphabet = '0123456789';
    const generateNumericId = customAlphabet(numericAlphabet, 10)
    const IDTransaction = generateNumericId()
    const ItemID = generateNumericId()

    return window.gtag && window.gtag('event', nameConversion, {
        'transaction_id': IDTransaction,
        'event_category': eventCategory, // Categoria do Evento
        'event_label': LabelEvent, // Nome do Evento ( Label )
        'value': value, // Valor do Evento
        'currency': 'BRL',
        'page_path': router,
        'items': [
          {
            id: ItemID,
            name: 'Consulta Online',
            price: value,
            quantity: 1,
            currency: 'BRL',
            category: `Consulta Online com o ${nomeMedico}`,
            brand: 'Interconsulta'
          }
        ]
    })
}