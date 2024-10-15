'use client'
import Image from 'next/image'
import Logo from '../../public/logo.png'
import { useRouter } from 'next/navigation';

const TermosDeUso = () => {
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
            <h1 className="text-2xl font-semibold">Termos de Uso - InterconsultaGID </h1>
            </div>
           </div>

          <p className="mb-4">
            Bem-vindo à plataforma interconsulta.org. Ao acessar ou utilizar nossos serviços, você concorda em obedecer a estes Termos de Uso. Por favor, leia atentamente antes de utilizar nossa plataforma.
          </p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">1. Uso da Plataforma</h2>
            <p>Ao utilizar a plataforma interconsulta.org, você concorda em utilizar nossos serviços apenas para os fins permitidos por estes Termos de Uso. Você não deve utilizar nossos serviços de forma que viole qualquer lei ou regulamento aplicável.</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">2. Cadastro e Conta</h2>
            <p>Para utilizar determinados recursos da plataforma, você pode precisar criar uma conta e fornecer informações pessoais. Você é responsável por manter a confidencialidade de suas credenciais de conta e por todas as atividades que ocorrerem em sua conta.</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">3. Responsabilidades do Usuário</h2>
            <p>Ao utilizar a plataforma interconsulta.org, você concorda em:</p>
            <ul className="list-disc pl-6">
              <li>Fornecer informações precisas e atualizadas;</li>
              <li>Respeitar os direitos de privacidade e confidencialidade dos outros usuários;</li>
              <li>Não divulgar informações pessoais ou confidenciais sem permissão;</li>
              <li>Não violar os direitos de propriedade intelectual de terceiros;</li>
              <li>Não realizar atividades que possam prejudicar ou interferir na operação da plataforma.</li>
            </ul>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">4. Conteúdo do Usuário</h2>
            <p>Ao fornecer conteúdo para a plataforma interconsulta.org (como comentários, avaliações, etc.), você concede à Interconsulta.org uma licença não exclusiva, transferível, sublicenciável, livre de royalties e mundial para usar, reproduzir, modificar, adaptar, publicar, traduzir e distribuir tal conteúdo.</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">5. Limitação de Responsabilidade</h2>
            <p>A plataforma interconsulta.org é fornecida "como está" e não fazemos garantias quanto à sua disponibilidade, precisão ou confiabilidade. Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou incapacidade de usar nossos serviços.</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">6. Alterações nos Termos de Uso</h2>
            <p>Reservamo-nos o direito de modificar ou atualizar estes Termos de Uso a qualquer momento. Se fizermos alterações significativas, iremos notificá-lo através de nossa plataforma ou por outros meios razoáveis. O uso continuado de nossos serviços após tais alterações constituirá sua aceitação dos Termos de Uso revisados.</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">7. Lei Aplicável</h2>
            <p>Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa decorrente ou relacionada a estes Termos de Uso estará sujeita à jurisdição exclusiva dos tribunais localizados no Brasil.</p>
          </div>
          <p>
            Ao utilizar a plataforma interconsulta.org, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes Termos, por favor, não utilize nossos serviços.
          </p>

          <div className='flex justify-center items-center w-full'>
              <button className='p-2 bg-blue-500 rounded-full w-1/2' onClick={() => HandleBackRouter()}>
                 <p className='font-bold text-white'> Voltar </p>
              </button>
          </div>
        </div>
      </div>
    )
}

export default TermosDeUso
  