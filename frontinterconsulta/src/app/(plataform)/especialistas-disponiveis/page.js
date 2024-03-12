'use client'
import Main from '../../components/Main.js'
import ContentPaciente from '../../components/ContentPaciente.js'
import Spinner from '../../components/Spinner' // Assuming you have a Spinner component for loading indicator

const EspecialistasDisponiveis = () => {
  return (
    <Main
      title="Urgencia no Atendimento?"
      subTitle="Seja atendido por um especialista do #interconsulta agora!"
      Component={ContentPaciente}
      loadingIndicator={<Spinner />}
    />
  )
}

export default EspecialistasDisponiveis
