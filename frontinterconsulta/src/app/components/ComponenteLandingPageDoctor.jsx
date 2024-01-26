'use client'
import { useState, useEffect } from 'react'
import { Accordion,AccordionSummary, AccordionDetails } from '@mui/material'
import Rating from '@mui/material/Rating'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { config } from '../config.js'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DoneIcon from '@mui/icons-material/Done'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Star from '../public/star.png'
import LogoGoogle from '../public/logoGoogle.png'

import AgendamentoConsulta from '../partials/Agendamento.js'
import { NotLogged } from '../partials/NotLoggedPopUp'
import secureLocalStorage from 'react-secure-storage'
import { usePathname, useRouter } from 'next/navigation'

import { useQuery } from "@tanstack/react-query"
import axios from 'axios'
import StarIcon from '@mui/icons-material/Star'
import { AvaliacoesCarousel } from '../partials/CarrouselAvaliations'
import { Link } from 'react-scroll'
import Tempo from '../public/Tempo (2).png'
import Custo from '../public/Custo (1).png'


export const ComponentLandingPageDoctor = ({ params }) => { 

  const [especialista, setEspecialista] = useState('')
  const [recomendacoes, setRecomendacoes] = useState('')
  const [paciente, setPaciente] = useState('')
  const [token, setToken ] = useState('')
  const [agendamentoDialogOpen, setAgendamentoDialogOpen] = useState(false)
  const [notLogged, setNotLogged] = useState(false)
  const [readOnlyMode, setReadOnlyMode] = useState(true)
  const [idMedico, setidMedico] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [quantidadeAvaliacoess, setQuantidadeAvaliacoes] = useState(null)
  const [doencaAtendidas, setDoencaAtendida] = useState([])
  const [ferramentasTerapeuticas, setFerramentasTerapeuticas] = useState(null)

  useEffect(() =>{
    const Token = secureLocalStorage.getItem('token')
    setToken(Token)
  },[])

  const AtualRote = usePathname()

  const DoencaLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('Doenca') : false
  const Doenca = DoencaLocal || ''

  const idLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('id') : false
  
  const id = idLocal || ''

  const RequestEspecialista = async () => {
    const response = await axios.get(`http://${config.apiBaseUrl}/api/get-especialista/${params}`)
    setidMedico(response.data.ModelEspecialista._id)
    const avaliacoes = response.data.ModelEspecialista.Avaliacoes || []
    setAvaliacoes(avaliacoes)

    
    const FerramentasTerapeuticas = response.data.ModelEspecialista.FerramentasTerapeuticas[0];
    const FerramentasFormatadas = FerramentasTerapeuticas.split(',').join(', ')
    setFerramentasTerapeuticas(FerramentasFormatadas)


    const DoencasAndSintomasDoctor = response.data.ModelEspecialista.DoencasAndSintomas
  
    const QueryDoencaOurSintomasDoctor = DoencasAndSintomasDoctor.find(
      (data) => data.Doenca === Doenca || data.Sintomas.includes(Doenca)
    )

    setDoencaAtendida(QueryDoencaOurSintomasDoctor)

    const quantidadeAvaliacoes = avaliacoes.length
    setQuantidadeAvaliacoes(quantidadeAvaliacoes)
    return response.data.ModelEspecialista
  }

  const RequestRecomendaçoes = async () =>{
    const response = await axios.get(`http://localhost:8080/api/get-recomendacoes/${params}`)
    return response.data.QueryEspecialidadesDB
  }

  const RequestPaciente = async () =>{
    const response = await axios.get(`http://localhost:8080/api/get-paciente/${id}`)
    return response.data.ModelPaciente 
  }

  const queryKey = ['Especialista', especialista];
  const { data: ModelEspecialista, isFetching, isError, isSuccess } = useQuery(queryKey, () => RequestEspecialista(especialista))

  const queryKeyRecomendaçoes = ['Recomendaçoes', recomendacoes]
  const { data: QueryEspecialidadesDB, isFetching: isFetchingRecomendacoes, isError: isErrorRecomendacoes } = useQuery(queryKeyRecomendaçoes, () => RequestRecomendaçoes(recomendacoes))

  const queryKeyPaciente = ['Paciente', paciente];
  const { data: ModelPaciente, isSuccess: SucessPaciente } = useQuery(queryKeyPaciente, () => RequestPaciente(paciente),{
    retry: false
  })

  const NomePaciente = secureLocalStorage.getItem('NomePaciente')

  const OpenDialog = () => {
    if(token !== null){
      setAgendamentoDialogOpen(!agendamentoDialogOpen)
    }else{
      setNotLogged(!notLogged)
    }
  }
  return(
    <>
    <div className="min-h-screen" id='Navegaçao1'>
 
     <header>
     <nav className="flex justify-between p-10">
     <Image src={Logo}  width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>
     <div className='gap-10 flex'> 
     <Link to="Navegaçao1" smooth={true} duration={500}>
       <p className='cursor-pointer'> Perfil</p>
     </Link>
     <Link to="Navegaçao2" smooth={true} duration={500}>
       <p className='cursor-pointer'> Causas </p>
     </Link>
     <Link to="Navegaçao3" smooth={true} duration={500}>
       <p className='cursor-pointer'> Beneficios</p>
     </Link>
     {avaliacoes.length > 0 ?
     <>
      <Link to="Navegaçao4" smooth={true} duration={500}>
        <p className='cursor-pointer'> Avaliaçoes </p>
     </Link>
     </> 
     :
       null
      }
     <Link to="Navegaçao4" smooth={true} duration={500}>
      <h1 className='cursor-pointer'> Duvidas </h1>
     </Link>
     </div>
     </nav>
     </header>
 
   <div className="flex w-full">
 
     <div className="flex flex-col w-3/4 gap-12 ml-20">

       <h1 className="text-5xl font-bold text-blue-500">
        {NomePaciente}, Nao deixe para tratar {Doenca} para depois
       </h1> 

       {SucessPaciente && isSuccess ?
        <h2 className="text-2xl"> Ola, {ModelEspecialista.NomeEspecialista} aproveite que tenho Horario livre na agenda e resolve seu problema de {ModelPaciente.Doenca}
        </h2> 
        : 
         <h2 className="text-2xl"> 
         {NomePaciente} eu irei solucionar o seu problema com {Doenca}
        </h2> 
        }

       {isSuccess ? 
         <button className="p-2 bg-green-500 rounded-lg font-bold text-white w-3/4"
         onClick={() => OpenDialog()}>
           Agendar com {ModelEspecialista.NomeEspecialista} 
         </button>
       : 
       <button className="p-2 bg-green-500 rounded-lg font-bold text-white w-3/4"
       onClick={() => OpenDialog()}>
         Agendar Consulta
       </button>
       }

       <div className="flex flex-col gap-5">
 
         <div className="flex gap-5">
          
         <ArrowForwardIcon color="primary"/>
         <h1>
           Recupere-se sem limitações: elimine {Doenca}!`
         </h1>
         </div>
 
         <div className="flex gap-5">
         <ArrowForwardIcon color="primary"/>
           Diga adeus à {Doenca}, viva plenamente!
         </div>
 
         <div className="flex gap-5">
         <ArrowForwardIcon color="primary"/>
           Inicie sua jornada para o bem-estar imediato – não deixe para depois!
         </div>
 
       </div>
     </div>
 
     <div className="flex justify-center items-center w-full">
      {isSuccess ? 
      <>
      <div className='flex flex-col w-full justify-center items-center gap-2'>
      <Image src={`http://localhost:8080/${ModelEspecialista.Foto}`}
         alt="Foto do Médico" 
         width={450}  
         height={450}
         className='rounded-xl'/>

      <h1 className='font-bold text-blue-500 text-xl'>
        {ModelEspecialista.EspecialidadeMedica}
      </h1>
     
      <h1 className='font-bold text-blue-500 text-xl'> 
        CRM: {ModelEspecialista.CRM} / RQE: {ModelEspecialista.RQE}
      </h1>

      <Rating
        name="simple-controlled"
        value={ModelEspecialista.mediaAvaliacoes}
        readOnly={readOnlyMode}
        icon={<StarIcon fontSize="large" />}
      />

      {quantidadeAvaliacoess === 1 ? 
       <h1 className='text-blue-500 font-bold'>Indicado por {quantidadeAvaliacoess} Paciente! </h1> : 
       quantidadeAvaliacoess > 1 ? 
       <h1>Indicados por {quantidadeAvaliacoess} Paciente! </h1>
       :
       quantidadeAvaliacoess === null &&
       null 
      }

      </div>
      </>
       : 
       <Image src={Logo} height={200} width={200} alt="Logo Interconsulta" className="animate-spin-slow"/>}
     </div>
   </div>
   </div>
 
 
 
   <div className=" min-h-screen flex justify-center gap-60 items-center w-full background" id='Navegaçao2'>

   {SucessPaciente ? 
    <img
    src={`http://localhost:8080/${ModelPaciente.GifDoenca}`} 
    alt="Gif Doença"
    width={500} 
    height={500}
    className='rounded-xl'
     />
   : 
   <Image src={Logo} width={400} height={400} alt="Logo Médico" className="animate-pulse"/>
   }

 
   <div className="flex flex-col gap-5 w-1/3">

  {SucessPaciente && isSuccess ?
   <>
    <h1 className="font-bold text-3xl text-blue-500"> 
    Não Ignore: Os Perigos de Deixar { ModelPaciente.Doenca } sem Tratamento Profissional!
    </h1>

    <p> 
     <span className="font-bold text-xl"> {ModelPaciente.nome} </span> Adiar o tratamento pode levar ao agravamento da condição, tornando-a mais difícil de controlar.
    </p>

    <p> 
      <span className="font-bold"> Postergar o tratamento </span> aumenta o risco de desenvolver complicações secundárias e problemas
      de saúde associados
    </p>

    <p> 
      <span className="font-bold"> Não adie seu bem-estar </span> inicie o tratamento agora comigo para uma recuperação mais rápida, segura e eficaz
    </p>

    <button className="p-2 bg-green-500 rounded-lg font-bold text-white w-3/4"
     onClick={() => OpenDialog()}>
      Agendar com {ModelEspecialista.NomeEspecialista} 
    </button>
    </>
    : 
    ''
    }
 
   </div>
 
   </div>
 
   <div className="p-10 w-full flex flex-col gap-10" id='Navegaçao3'>

     <div className="flex justify-center items-center gap-10 w-full"> 

         <div className="flex flex-col gap-5 justify-center items-center">
          {isSuccess ?
             <div className='border-blue-500 border-4 rounded-full w-20'>  
             <Image src={`http://localhost:8080/${ModelEspecialista.FotoEspecialidade}`}
                alt="Foto do Médico" 
                width={100}
                height={100}
              />
             </div>
          :  
           <div className="h-12 w-16 rounded-full bg-blue-200"></div>
          }
           <h1 className="font-bold text-blue-500 text-xl text-center">
            Acesso Descomplicado
           </h1>
           {SucessPaciente && isSuccess ? 
             <p className='text-center'>
                Tenha acesso a um Especialista que esta há {ModelEspecialista.QuantidadeTempoAnoGraduacao} anos no mercado de {ModelEspecialista.EspecialidadeMedica} formado pela {ModelEspecialista.FormacaoEspecialista}
             </p> :
            ''
            }
         </div>
 
         <div className="flex flex-col gap-5 justify-center items-center">
         {isSuccess ?
             <div className='border-blue-500 border-4 rounded-full w-20'>  
             <Image src={Tempo}
                alt="Foto do Médico" 
                width={100}
                height={100}
              />
             </div>
          :  
           <div className="h-12 w-16 rounded-full bg-blue-200"></div>
          }
           <h1 className="font-bold text-blue-500 text-xl text-center">
             Otimize Seu Tempo
            </h1>
           <p className='text-center'>
            {SucessPaciente  && isSuccess ? 
            <p> A Telemedicina na área de {ModelEspecialista.AreadeAtuacao} proporciona cuidado médico adaptado para {ModelPaciente.Doenca}, com consultas personalizadas e atenção dedicada, tudo no conforto do seu lar.</p> 
            : 
            ''
            }
           </p>
         </div>
 
       
         <div className="flex flex-col gap-5 justify-center items-center">
         {isSuccess ?
             <div className='border-blue-500 border-4 rounded-full w-20'>  
             <Image src={Custo}
                alt="Foto do Médico" 
                width={100}
                height={100}
              />
             </div>
          :  
           <div className="h-12 w-16 rounded-full bg-blue-200"></div>
          }
           <h1 className="font-bold text-blue-500 text-xl text-center"> 
           Economize Recursos
           </h1>
           <p className='text-center'> 
           {ferramentasTerapeuticas  && SucessPaciente? 
            `Utilizo como alternativa para o tratamento de ${ModelPaciente.Doenca} o uso de ${ferramentasTerapeuticas}`
             :
            ''
           }
           </p>
         </div>
     </div>  
   </div>
              
 
  {avaliacoes.length > 0 ? 
    (SucessPaciente && isSuccess ? (
      <>
        <div className="min-h-screen flex flex-col justify-center items-center gap-16 w-full background p-10"
        id='Navegaçao4'>
        <h1 className='font-bold text-blue-500 text-2xl text-center'>
          Saiba o que os outros pacientes estão falando <br/>
          sobre a consulta do {ModelEspecialista.NomeEspecialista}
        </h1>
        <div className="flex gap-5 w-full justify-center items-center">
          {SucessPaciente && isSuccess ? (
            avaliacoes.length > 0 ? 
              avaliacoes.map((data, index) => (
                <div className='w-1/4 flex flex-col gap-5' key={index}>
                  <h1>  {data.AvaliacoesText} </h1>
                  <div className='flex gap-5'>
                    <Image  
                      src={`http://localhost:8080/${data.Foto}`} 
                      height={50} 
                      width={50} 
                      alt="Logo Interconsulta" 
                      className='rounded-full'
                    />
                    <div className="flex justify-center items-center">
                      <h1 className="font-bold text-blue-500"> {data.NomePaciente} </h1>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Rating
                      name="simple-controlled"
                      value={data.AvaliacoesStar}
                      readOnly={readOnlyMode}      
                    />
                  </div>
                </div>
              )) 
              : ''
          ) : ''}
        </div>

     <div className="flex gap-10">
       <h1 className="font-bold text-lg">We Have 100+ 5 Stars Review on</h1>
       <Image src={LogoGoogle} width={100} height={100} alt="Logo Google"/>
     </div>
     </div>
      </>
    ) : '') 
    : 
    null
    }
 
   <div className="min-h-screen flex justify-center items-center flex-col gap-20 w-full background" id='Navegaçao4'>
 
   <div className="flex gap-5">
     <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>
     <div className="flex justify-center items-center">
      {SucessPaciente ? 
      <h1 className="font-bold text-2xl text-center text-blue-500"> 
      Principais duvidas sobre {ModelPaciente.Doenca}
      </h1>
      : 
      <h1 className="font-bold text-2xl text-center text-blue-500"> FAQ</h1>
      }
     </div>
   </div>
 
   <div className="w-full flex flex-col justify-center items-center gap-10">

    {SucessPaciente ? 
    <>
    <Accordion className="w-1/2">

         <AccordionSummary
         expandIcon={<ExpandMoreIcon color="primary"/>}
         aria-controls="panel1a-content"
         id="panel1a-header"
         >
           <h1> Quais sao as Principais Causas de {ModelPaciente.Doenca} </h1>
         </AccordionSummary>
          <AccordionDetails>
          <h1>
            {doencaAtendidas && 
              <p>
                {doencaAtendidas.PrincipaisCausas}
              </p>
             }
          </h1>
        </AccordionDetails>
     </Accordion>

     <Accordion className="w-1/2">
         <AccordionSummary
         expandIcon={<ExpandMoreIcon color="primary"/>}
         aria-controls="panel1a-content"
         id="panel1a-header"
         >
           <h1>  Quais São as Principais Formas de Tratamento para {ModelPaciente.Doenca}</h1>
         </AccordionSummary>
       <AccordionDetails>
       {doencaAtendidas && 
              <p>
                {doencaAtendidas.FormasDeTratamento}
              </p>
       }
         </AccordionDetails>
     </Accordion>
     <Accordion className="w-1/2">
         <AccordionSummary
         expandIcon={<ExpandMoreIcon color="primary"/>}
         aria-controls="panel1a-content"
         id="panel1a-header"
         >
           <h1> Saiba Como Previnir {ModelPaciente.Doenca} </h1>
         </AccordionSummary>
       <AccordionDetails>
       {doencaAtendidas && 
              <p>
                {doencaAtendidas.ComoPrevenir}
              </p>
       }
         </AccordionDetails>
     </Accordion>
     <Accordion className="w-1/2">
         <AccordionSummary
         expandIcon={<ExpandMoreIcon color="primary"/>}
         aria-controls="panel1a-content"
         id="panel1a-header"
         >
           <h1> {ModelPaciente.Doenca} tem Cura? </h1>
         </AccordionSummary>
       <AccordionDetails>
       {doencaAtendidas && 
              <p>
                {doencaAtendidas.TemCura}
              </p>
       }
         </AccordionDetails>
     </Accordion>
    </>
    :
    <>
    ''
    </>
     }
     
   </div>
  </div> 
 
 
 <div className="p-10 flex flex-col gap-5 w-full">
     {SucessPaciente && isSuccess ? 
     <h1 className='text-center font-bold text-blue-500 text-3xl'> 
      Aproveite a disponibilidade da agenda de {ModelEspecialista.NomeEspecialista}
     </h1>
      :
     <h1 className='text-center font-bold text-blue-500 text-3xl'> Aproveite a disponibilidade Médica</h1>
     }
     <div className="w-full flex justify-center items-center">
       <button className="p-2 bg-green-500 rounded-lg font-bold text-white w-1/2"
        onClick={() => OpenDialog()}> 
        {isSuccess && SucessPaciente ? 
        <p> Resolva agora o seu problema de {ModelPaciente.Doenca} </p> : 
        <> 
        <p> Agendar Consulta</p>
        </>
        }
         </button>
     </div>
     
     </div>

 {agendamentoDialogOpen &&
     <AgendamentoConsulta
       EspecialidadeMedica={ModelEspecialista ? ModelEspecialista.EspecialidadeMedica : ''} 
       titleButon={ModelEspecialista ? `Agendar com ${ModelEspecialista.NomeEspecialista}` : 'Agendar consulta'}
       NomeMedico={ModelEspecialista ? ModelEspecialista.NomeEspecialista : ''}
       Horarios={ModelEspecialista.Horarios}
       idMedico={idMedico}
       ValorConsulta={ModelEspecialista ? ModelEspecialista.PrecoConsulta : ''}
       FotoMedico={ModelEspecialista ? ModelEspecialista.Foto : ''}
       avaliacoes={ModelEspecialista ? ModelEspecialista.mediaAvaliacoes : ''}
      />
 }
 {notLogged &&
  <NotLogged
   messageOne="Atençao!!!!"
   messageTwo="Voce nao esta Logado, por favor para agendar consultas faça login agora mesmo clicando no botao abaixo!" 
   />
   }
   </>
  )
}