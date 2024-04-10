import { useEffect, useState } from "react"

export const useViewContentGoogleAds = (route) => {

    const [ok, setOkay] = useState(false)

    useEffect(() => {
        setOkay(true)
        if(ok){
          setTimeout(() => {
            window.gtag('event', 'conversion_event_page_view', {
              'event_category': 'Carregamento da Pagina',
              'event_label': 'Visualização do Conteudo',
              'page_path': route
            })
          }, 300)
       
        }
     }, [route, ok])
}
