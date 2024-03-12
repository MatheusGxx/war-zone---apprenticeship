'use client'
import MainUnidade from '../../components/MainUnidade.js'
import Loading from './loading.js'
import ContentUnidade from '../../components/ContentUnidade.js'

const UnidadeEspecialista = () => {
  return (
    <MainUnidade
      title="Gestão Integrada de Recursos"
      subTitle="Gestor, baixe sua planilha de exemplo aqui!"
      Component={ContentUnidade}
      fallback={<Loading />}
    />
  )
}

export default UnidadeEspecialista
