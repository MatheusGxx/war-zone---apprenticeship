'use client'
import Obrigado from '../../../../../components/Obrigado.js'
import ImagemLateralObrigadoMédico from '../../../../../public/ObrigadoMédico.png'
import FormularioMédico from '@/app/partials/FormularioMédico.js'

const ObrigadoMédico = () =>{
  
  return(
    <>
     <Obrigado ImagemLateral={ImagemLateralObrigadoMédico} title="Parabens Dr(a)"  copy="Lorem Ipsum is simply dummy text of the printing and typesetting industry.
     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
     when an unknown printer took a galley of type and scrambled it to make a type specimen book, Lorem Ipsum is simply dummy text of the printing and typesetting industry.
     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
     when an unknown printer took a galley of type and scrambled it to make a type specimen book." button={FormularioMédico}/>
    </>
  )
}

export default ObrigadoMédico