'use client'
import Logo from '../public/logo.png'
import Image from 'next/image';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useQuery } from "@tanstack/react-query"
import AgendamentoConsulta from '../partials/Agendamento.js'
import { usePathname, useRouter } from 'next/navigation';
import { NotLogged } from '../partials/NotLoggedPopUp'
import secureLocalStorage from 'react-secure-storage'
import Rating from '@mui/material/Rating'
import { config } from '../config.js'

export default function PerfilMédico({ params }) {
  const [especialista, setEspecialista] = useState('')
  const [recomendacoes, setRecomendacoes] = useState('')
  const [paciente, setPaciente] = useState('')
  const [agendamentoDialogOpen, setAgendamentoDialogOpen] = useState(false)
  const [token, setToken ] = useState('')
  const [notLogged, setNotLogged] = useState(false)
  const[idMedico, setidMedico] = useState(null)
  const [readOnlyMode, setReadOnlyMode] = useState(true)

  const Router = useRouter()

  const AtualRote = usePathname()

  useEffect(() =>{
    const Token = secureLocalStorage.getItem('token')
    setToken(Token)
  },[])


  const DoencaLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('Doenca') : false
  const Doenca = DoencaLocal || ''

  const idLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('id') : false
  
  const id = idLocal || ''

  const RequestEspecialista = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/get-especialista/${params}`)
    setidMedico(response.data.ModelEspecialista._id)
    return response.data.ModelEspecialista
  }

  const RequestRecomendaçoes = async () =>{
    const response = await axios.get(`${config.apiBaseUrl}/api/get-recomendacoes/${params}`)
    return response.data.QueryEspecialidadesDB
  }

  const RequestPaciente = async () =>{
    const response = await axios.get(`${config.apiBaseUrl}/api/get-paciente/${id}`)
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

  const avaliacoes = ModelEspecialista?.Avaliacoes || [];

 
  const HandleNavigation = (slug2) => {    
    Router.push(`/especialistas-disponiveis/${slug2}`);
  }

  const HandleOpenDialog = () => {
    if(token !== null){
      setAgendamentoDialogOpen(!agendamentoDialogOpen)
    }else{
      setNotLogged(!notLogged)
    }
  }

  return (
    <>
      <main className="flex-1 bg-blue-100 flex flex-col gap-8 lg:p-4 justify-center items-center w-full">

          <div className='flex justify-center items-center w-full'>

            <div className='flex items-center mt-5 justify-between w-3/4 sm:flex sm:flex-col sm:gap-8 md:flex md:flex-col md:gap-8 lg:flex lg:justify-center lg:gap-20 lg:w-full'>

              <div>
                <h2 className="text-2xl text-blue-900 font-bold whitespace-nowrap">Perfil Especialista</h2>
                <div className="border-b-2 border-blue-500  w-4/5  pt-3"></div>
              </div>

              <button className='w-48 h-10 text-sm bg-green-500 pb-1 rounded-full font-bold text-white sm:h-10 sm:w-48 md:w-48 lg:w-64' onClick={() => HandleOpenDialog()}>
                <p className='sm:text-sm text-center whitespace-nowrap text-xl'> 
                Agende agora  
                </p>
              </button>  
          
              {agendamentoDialogOpen &&
               <AgendamentoConsulta
                AreadeAtuaçao={ModelEspecialista ? ModelEspecialista.AreadeAtuacao : ''} 
                titleButon={ModelEspecialista ? `Agendar com ${ModelEspecialista.NomeEspecialista}` : 'Agendar consulta'}
                NomeMedico={ModelEspecialista ? ModelEspecialista.NomeEspecialista : ''}
                Horarios={ModelEspecialista.Horarios}
                idMedico={idMedico}
                />
                }
              {notLogged && <NotLogged messageOne="Atençao!!!!" messageTwo="Voce nao esta Logado, por favor para agendar consultas faça login agora mesmo clicando no botao abaixo!" />}

            </div>

          </div>

      
          <div className="flex">
          {isFetching ? (
            <Image src={Logo} height={100} width={100} className='animate-pulse' alt="Carregando" />
          ) : (
            <>
              {isError ? (
                <div className="flex sm:flex sm:flex-wrap sm:text-base">
                  <div className="flex justify-center items-center">
                    <h1 className='font-bold text-2xl'> Médico Nao disponivel no Momento </h1>
                  </div>
                </div>
              ) : (
                <section className='bg-white min-h-[380px] rounded-lg p-10'>
                  {isSuccess && ModelEspecialista &&  (
                    <>
                      <div className='flex-col'>

                      <div className="flex gap-8 sm:flex sm:flex-col md:flex md:flex-col w-full">
                        <Image src={`${config.apiBaseUrl}/${ModelEspecialista.Foto}`} width={350} height={350} alt="Foto Especialista" className='rounded-lg lg:w-full' />
                        
                        <div className='flex flex-col gap-3'>
                          
                          {ModelPaciente && SucessPaciente && isSuccess && ModelEspecialista ? (
                                  <>
                                  <h1 className='text-blue-900 font-bold text-start text-2xl'> Olá, {ModelPaciente.nome}!</h1>
    
                                  <h2 className='text-blue-800'> Meu nome é {ModelEspecialista.NomeEspecialista}, sou {ModelEspecialista.AreadeAtuacao} e estou aqui para te ajudar a tratar {ModelPaciente.Doenca} <br/> <br/> Abaixo estao algumas informaçoes sobre as minhas atribuiçoes médicas enquanto {ModelEspecialista.EspecialidadeMedica}  <br/> e caso precise de ajuda nao deixe de agendar uma consulta comigo.</h2>
    
                                  <div className='flex justify-center items-center mt-5'>
                                  <button className='w-full h-10 text-sm bg-green-500 rounded-full font-bold text-white sm:h-8 md:w-48 lg:w-64' onClick={() => HandleOpenDialog() }>
                                   <p className='sm:text-sm text-center whitespace-nowrap text-lg'> Agende agora!</p></button>
                                 </div> 
       
                                 </>
                           ) : (
                           <>
                              <h1 className='text-blue-900 font-bold text-start text-2xl'> Olá!</h1>

                                  <h2 className='text-blue-800'> Meu nome é {ModelEspecialista.NomeEspecialista}, sou {ModelEspecialista.AreadeAtuacao} e estou aqui para te ajudar <br/> <br/> Abaixo estao algumas informaçoes sobre as minhas atribuiçoes médicas enquanto {ModelEspecialista.EspecialidadeMedica}  <br/> e caso precise de ajuda nao deixe de agendar uma consulta comigo.</h2>
          
                                 <div className='flex justify-center items-center mt-5'>
                                 <button className='w-full h-10 text-sm bg-green-500 rounded-full font-bold text-white sm:h-8 md:w-48 lg:w-64' onClick={() => HandleOpenDialog() }>
                                 <p className='sm:text-sm text-center whitespace-nowrap text-lg'> Agende agora!</p></button>
                                </div> 
                           </>
                           )}

                        </div>
                          
                        </div>


                        <div className="flex flex-col gap-3 mt-5 justify-center items-center">

                        <div className="border-b-2 border-blue-500  w-11/12  pt-3"></div>

                          <h1 className='text-blue-500 font-bold text-center text-xl'>Conheça minha jornada médica até aqui:</h1>

                         <div className="mt-5 mb-5">
                           <h3 className='text-start whitespace-wrap font-normal'> {ModelEspecialista.ResumoProfissional} </h3>
                         </div>

                          <div>
                            <h2 className='font-bold text-blue-900 text-lg'>Certificaçoes: <span className='text-black font-normal'> {ModelEspecialista.Certificacao}</span></h2>
                            <h2 className='font-bold text-blue-900 text-lg'>Formaçao: <span className='text-black font-normal'> {ModelEspecialista.FormacaoEspecialista}</span></h2>
                            <h2 className='font-bold text-blue-900 text-lg'>Especializaçoes: <span className="text-black font-normal">{ModelEspecialista.EspecialidadeMedica}</span></h2>
                            <h2 className='font-bold text-blue-900 text-lg'>Area de Atuaçao: <span className="text-black font-normal">{ModelEspecialista.AreadeAtuacao}</span></h2>
                            <h2 className='font-bold text-blue-900 text-lg'>CRM: <span className='text-black font-normal'> {ModelEspecialista.CRM}</span></h2>
                          </div>

                          <div className="border-b-2 border-blue-500  w-11/12  pt-3"></div>

                          <div className="mt-5 w-full flex justify-center items-center flex-col gap-1">
                          {isSuccess ? (
                              <>
                                <h1 className="text-blue-600 font-bold text-center text-xl">Avaliações:</h1>
                                {avaliacoes.length > 0 ? (
                                  <div>
                                    {avaliacoes.map((avaliacao, index) => (
                                      <div key={index} className="flex flex-col mt-5 gap-3">
                                        <div className="flex justify-center items-center">
                                          <Image src={`${config.apiBaseUrl}/${avaliacao.Foto}`} alt="Foto do Paciente" width={60} height={60} className="sm:rounded-full rounded-lg" />
                                        </div>
                                        <div className="flex gap-1 flex-col">
                                          <div className="flex justify-center items-center">
                                            <Rating name="simple-controlled" value={avaliacao.AvaliacoesStar} readOnly={readOnlyMode}/>
                                          </div>
                                          <div className="flex justify-center items-center">
                                            <p className="text-blue-900"> {avaliacao.AvaliacoesText}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    {ModelPaciente && ModelEspecialista && isSuccess ? (
                                      <div className='w-1/2 flex justify-center'>
                                        <p className='text-blue-500 text-xl'>{ModelPaciente.nome}, deixe a sua avaliaçao sobre o atendimento do {ModelEspecialista.NomeEspecialista} para ajudar outros pacientes a tratar {ModelPaciente.Doenca}</p>
                                      </div>
                                    ) : (
                                      <p>Sem Avaliaçoes no Momento</p>
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              <p>Carregando...</p>
                            )}

                          </div>

                          <div className="border-b-2 border-blue-500  w-11/12  pt-3"></div>

                          {ModelPaciente && SucessPaciente && ModelEspecialista && isSuccess ? (
                            <>
                              <div>
                              <h2 className='text-blue-600 text-center text-lg'> {ModelPaciente.nome} chegou a hora que voce sempre sonhou <br/> trate agora o seu problema com {ModelPaciente.Doenca} com  {ModelEspecialista.NomeEspecialista}</h2>
                            </div>  

                            </>
                          ) :(
                            <>
                            <div>
                              <h2 className='text-blue-600 text-center text-lg'> Chegou a hora que voce sempre sonhou <br/> trate agora o seu problema  com  {ModelEspecialista.NomeEspecialista}</h2>
                            </div>
                            </>
                          )
                          }
                      
                            <button className='w-48 h-10 text-sm bg-green-500 pb-1 rounded-full font-bold text-white sm:h-10 sm:w-48 md:w-48 lg:w-64' onClick={() => HandleOpenDialog()}>
                               <p className='sm:text-sm text-center whitespace-nowrap text-xl'> 
                                  Agende agora  
                               </p>
                            </button>  

                            <div>
                              <h2 className='text-blue-600 text-start text-lg'> Salve uma vida compartilhando</h2>
                            </div>  

                            <button className='w-1/2 h-10 text-sm bg-orange-500 pb-1 rounded-full font-bold text-white sm:h-10 sm:w-48 md:w-48 lg:w-64'>
                               <p className='sm:text-sm text-center whitespace-nowrap text-xl'> 
                                  <a 
                                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Perfil Médico:')} ${encodeURIComponent(`https://agendamedica.digital${AtualRote}?utm_source=whatzapp&utm_medium=convite`)}`} 
                                  target='_blank'> Compartilhar no Whatsapp</a>
                               </p>
                            </button>  
                        </div>

                      </div>
                    </>
                  )}
                </section>
              )}
            </>
            )}
          </div>


         <div className="flex justify-center items-center flex-col gap-10">
              <div>
                <h2 className="text-2xl text-blue-900 font-bold whitespace-nowrap lg:text-xl md:text-center xl:text-center">Outras Recomendaçoes</h2>
                <div className="border-b-2 border-blue-500  w-3/5  pt-3"></div>
         </div>
         </div>

      </main>

      <div className='flex items-center justify-center bg-blue-100 pb-8'>
      {isFetchingRecomendacoes ? (
      <Image src={Logo} height={100} width={100} className='animate-pulse' alt="Logo Interconsulta" />
      ) : (
      <>
        {isErrorRecomendacoes ? (
          <div className="flex sm:flex sm:flex-wrap sm:text-base">
            <div className="flex justify-center items-center">
              <h1 className='font-bold text-2xl'> Médico Nao disponivel no Momento </h1>
            </div>
          </div>
        ) : (
      <div className="w-full flex justify-center items-center mt-4">
        <div className="bg-white p-5 rounded-lg flex gap-10 flex-col">

          {QueryEspecialidadesDB.map((item, index) => (
            <div key={index} className='flex gap-12 cursor-pointer' onClick={() => HandleNavigation(item.Slug)}>
                <Image src={`${config.apiBaseUrl}/${item.Foto}`} height={100} width={100} alt="Foto Especialista" className='rounded-lg'/> 
              <div className="flex-col">
                <h1 className="text-center text-blue-900 font-bold">{item.NomeEspecialista}</h1>
                <h1 className='text-center text-blue-600 font-bold'>{item.AreadeAtuacao}</h1>
                <h1 className="text-center text-black">CRM: {item.CRM}</h1>
              </div>
            </div>
          ))}

        </div>
      </div>
    )}
      </>
    )}
     </div>
    </>
  );
}

