'use client'

import CadastroPacienteLead from '@/app/components/CadastroPaciente.jsx'
import ImagemLateral from '../../../../public/ImageLogin.png'

const CadastroPaciente = () => {
  return(
    <>
    <CadastroPacienteLead title="Headline" subtitle="SubHeadline" ImagemLateral={ImagemLateral} apelido="Paciente" mensagem="Voce esta muito perto de ser Atendido por um dos médicos do Interconsulta"/>
    </>
  )
}

export default CadastroPaciente

