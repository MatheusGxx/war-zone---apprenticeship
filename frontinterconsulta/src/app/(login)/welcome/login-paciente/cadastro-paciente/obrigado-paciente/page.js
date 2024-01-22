'use client'
import Obrigado from '../../../../../components/Obrigado.js'
import ImagemLateralObrigadoPaciente from '../../../../../public/ImageLogin.png'

const ObrigadoPaciente = () =>{
  return(
    <>
     <Obrigado ImagemLateral={ImagemLateralObrigadoPaciente} title="Parabens Paciente"  copy="Lorem Ipsum is simply dummy text of the printing and typesetting industry.
     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
     when an unknown printer took a galley of type and scrambled it to make a type specimen book, Lorem Ipsum is simply dummy text of the printing and typesetting industry.
     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
     when an unknown printer took a galley of type and scrambled it to make a type specimen book."/>
    </>
  )
}

export default ObrigadoPaciente