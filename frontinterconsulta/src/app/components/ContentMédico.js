'use client'
import { useState, useEffect } from "react"
import { NotLogged } from "../partials/NotLoggedPopUp"
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'
import Image from 'next/image'
import Logo from '../public/logo.png'
import iconNull from '../public/IconNull.png'
import { CasosClinico } from "../partials/popUpCasoClinico"
import { useRouter } from "next/navigation"

import { useHorariosDoctor } from "../context/context"
import PopUpMedicoHoras from "../partials/PopUpHorasMedico"

import secureLocalStorage from 'react-secure-storage'
import { config } from '../config.js'

const ContentMédico = () => {

  const [notLogged, setNotLogged] = useState(false)
  const [notHorarios, setNotHorarios] = useState(false)
  const [selectedCasosClinicos, setSelectedCasosClinicos] = useState([])
  const { horariosDoctor } = useHorariosDoctor()
  const Navigation = useRouter()

  const idLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('id') : false
  const id = idLocal || ''

  const AreadeAtuaçaoLocal = secureLocalStorage.getItem('AreadeAtuacao')
  const AreadeAtuaçao = AreadeAtuaçaoLocal || ''

  useEffect(() => {

    const Token = typeof window !== "undefined" ? secureLocalStorage.getItem('token') : false
    if(Token === null){
      setNotLogged(true)
    }else{
      CreateRequestMutation.mutateAsync()
    }
  }, [])


  const CreateRequestMutation = useMutation(async () => {
    const request = await axios.post(`${config.apiBaseUrl}/api/get-casos-clinicos/${id}`);
    setSelectedCasosClinicos(request.data.HistoricoCasosClinicos.length)
    return request.data.HistoricoCasosClinicos 
  })

  const HandleNavigationNotLoggued = () => {
   Navigation.push('/welcome/login-medico')
  }

  return (
    <>
      <div className='flex justify-center mt-10 gap-5 mb-3'>
        <h1 className="font-bold text-blue-950 text-2xl text-center sm:text-xl"> Casos Clinicos para {AreadeAtuaçao}</h1>
      </div>

      <h1 className="font-bold text-blue-600 text-2xl text-center sm:text-xl">Quantidade de Casos Clinicos: {selectedCasosClinicos}</h1>
   
      {notLogged &&
      <>
       <div className="flex justify-center items-center flex-col gap-5">
         <h1 className="text-center text-blue-600 text-xl sm:whitespace-pre-wrap"> Doutor voce nao esta Logado para acessar todos os Nossos casos clinicos
          Logue Agora!
         </h1>
         <button
         className="p-2 bg-red-600 w-1/3 rounded-full text-white font-bold"
         onClick={HandleNavigationNotLoggued}> 
         Faça Login Agora </button>
       </div>
      <NotLogged 
      messageOne="Atenção Dr(a)!!!" 
      messageTwo="Você não está logado. Por favor, faça login para poder ver todos os nossos casos clínicos" />
      </>
      }
     
        <div className="flex justify-center items-center flex-wrap gap-5">
          {CreateRequestMutation.isError ? (
            <div className="flex justify-center items-center text-xl gap-3 sm:flex sm:flex-wrap sm:text-base md:flex md:flex-col">
              <h1> Casos Clinicos Indisponiveis </h1>
              <Image src={iconNull} alt="Médico não está disponível no momento" width={50} height={50} />
            </div>
          ) : CreateRequestMutation.isSuccess ? (
            <div className="flex gap-7 flex-wrap mb-7 justify-center items-center sm:gap-10">
              {CreateRequestMutation.data.map((casosClinicosData, index) => (
                <>
                  <div
                  key={index}
                  className="cursor-pointer flex flex-col border-4 rounded-xl p-5 sm:w-10/12"
                >
                  <div className=" flex justify-center items-center sm:flex sm:justify-center mb-2 sm:mb-0">
                    <Image
                      src={`${config.apiBaseUrl}/${casosClinicosData.Historico[0].FotoAreaAtuacao}`}
                      alt="Foto do Caso Clinico"
                      width={200}
                      height={200}
                      className="sm:rounded-full rounded-xl"
                    />
                  </div>

                   <p className="text-indigo-950 font-bold">Idade: {casosClinicosData.Idade}</p>
                   <p className="text-indigo-950 font-bold">Sexo: {casosClinicosData.Sexo}</p>
                   <p className="font-bold text-red-600">Caso Finalizado</p>
                  
                </div>
                </>
              ))}
            </div>
          ) :  null}

          {notHorarios && <PopUpMedicoHoras onClose={() => CloseNotHorarios()} />}
        </div>

        <div className="flex justify-end mt-5 mr-3 mb-5">
          <Image src={Logo} width={40} height={40} alt="Logo Interconsulta" className="animate-spin-slow"/>
        </div>

        {horariosDoctor && <PopUpMedicoHoras/>}

    </>
  );
};

export default ContentMédico;
