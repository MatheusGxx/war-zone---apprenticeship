'use client'
import { Link } from 'next/link'
import Cadastro from '../../../../components/Cadastro.js'

const CadastroMedico = () => {
  const { title, OneRoute, SecondRoute, TreeRoute, apelido, mensagem } = Cadastro({
    title: 'Cadastre-se abaixo Dr(a)',
    OneRoute: <Link href="/login-medico">Login como Médico</Link>,
    SecondRoute: <Link href="/cadastro-medico">Cadastro como Médico</Link>,
    TreeRoute: <Link href="/obrigado-medico">Obrigado, Dr(a)</Link>,
    apelido: 'Dr(a)',
    mensagem: 'Voce esta muito Proximo de se tornar um Médico Oficial do Interconsulta',
  })

  return <>{title}{OneRoute}{SecondRoute}{TreeRoute}</>
}

export default CadastroMedico
