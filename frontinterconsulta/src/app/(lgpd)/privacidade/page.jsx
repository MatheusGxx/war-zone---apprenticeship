'use client'
import Image from 'next/image'
import Logo from '../../public/logo.png'
import { useRouter } from 'next/navigation';

const PoliticaDePrivacidade = () => {
  const Router = useRouter()

  const HandleBackRouter = () => {
    Router.back()
  }
    return (
      <div className="min-h-screen flex justify-center items-center p-8">
        <div className="border-2 border-blue-500 rounded-xl w-10/12 p-5">

           <div className="flex gap-3 mb-4">
            <Image src={Logo} alt="Logo Atestado" width={50} height={50} className='sm:hidden md:hidden'/>
            <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-semibold">Política de Privacidade - InterconsultaGID </h1>
            </div>
           </div>

          <p className="mb-4">
            O Interconsulta.org está comprometido em proteger a privacidade dos usuários de nossa plataforma. Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos as informações pessoais dos pacientes que utilizam nossos serviços.
          </p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Informações Coletadas</h2>
            <p>Ao se cadastrar em nossa plataforma, podemos coletar as seguintes informações pessoais dos pacientes:</p>
            <ul className="list-disc pl-6">
              <li>Informações de identificação, como nome, data de nascimento e informações de contato (endereço de e-mail, número de telefone, etc.).</li>
              <li>Informações de saúde, como histórico médico, condições médicas atuais, alergias, medicamentos em uso e outras informações relevantes para o atendimento médico.</li>
              <li>Informações de uso, incluindo dados de navegação na plataforma, interações com médicos e outros profissionais de saúde, e informações relacionadas ao uso de nossos serviços.</li>
            </ul>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Uso das Informações</h2>
            <p>Utilizamos as informações coletadas dos pacientes para os seguintes propósitos:</p>
            <ul className="list-disc pl-6">
              <li>Facilitar a conexão entre pacientes e médicos, proporcionando atendimento médico personalizado e de qualidade.</li>
              <li>Personalizar a experiência do usuário na plataforma, fornecendo conteúdo relevante e recomendações com base nas necessidades de saúde individuais.</li>
              <li>Melhorar nossos serviços, desenvolvendo novos recursos, realizando análises de dados e monitorando a eficácia de nossos processos.</li>
            </ul>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Compartilhamento de Informações</h2>
            <p>Não compartilhamos informações pessoais dos pacientes com terceiros sem o consentimento prévio, exceto nos seguintes casos:</p>
            <ul className="list-disc pl-6">
              <li>Com médicos e outros profissionais de saúde envolvidos no atendimento ao paciente, conforme necessário para fornecer os serviços solicitados.</li>
              <li>Com autoridades governamentais, em conformidade com a lei ou para proteger nossos direitos legais.</li>
            </ul>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Segurança das Informações</h2>
            <p>Empregamos medidas de segurança técnicas, administrativas e físicas para proteger as informações pessoais dos pacientes contra acesso não autorizado, uso indevido ou divulgação.</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Alterações na Política de Privacidade</h2>
            <p>Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas de privacidade. Recomendamos que os pacientes revisem regularmente esta página para ficarem informados sobre como protegemos suas informações pessoais.</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Contato</h2>
            <p>Se tiver alguma dúvida ou preocupação sobre nossa Política de Privacidade ou o uso de suas informações pessoais, entre em contato conosco através do endereço de e-mail interconsulta.org@gmail.com.</p>
          </div>

          <div className='flex justify-center items-center w-full'>
              <button className='p-2 bg-blue-500 rounded-full w-1/2' onClick={() => HandleBackRouter()}>
                 <p className='font-bold text-white'> Voltar </p>
              </button>
          </div>
        </div>
      </div>
    )
}

export default PoliticaDePrivacidade
