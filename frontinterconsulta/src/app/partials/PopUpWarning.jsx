import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import { useMutation } from '@tanstack/react-query'
import { Documents } from './Documents'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'
import { config } from '../config'

export const PopUpWarningDoctor = ({ 
  onClose,
  ficha,
  Diagnóstico,
  Tratamento,
  FerramentaTerapeutica,
  Progresso,
  SolicitaçaoMateriais,
  Recomendacoes,
  estado,
  ReceitaSimpleS,
  ReceitaControlada,
  diasAfastamento,
  SolicitarExames,
  nomePaciente,
  nomeMedico,
  CRMMedico,
  UFMedico,
  EstadoMedico,
  BairroMedico,
  CidadeMedico,
  CPFPaciente,
  EnderecoMedico,
  CID,
  CidadePaciente,
  EstadoPaciente,
  CPFMedico,
  EnderecoPaciente,
  IdentificadorConsulta,
  date,
  hora,

 }) => {
  const [open, setOpen] = useState(false)
  const [nextPopup, setNextPopup] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  const handleClose = () => {
    onClose()
    setOpen(false)
  }

  const idLocal = secureLocalStorage.getItem('id');
  const id = idLocal || ''

  const SavedConsulta = useMutation(async(valueBody) =>{
    const request = await axios.post(`${config.apiBaseUrl}/api/conclusion-room-medico`, valueBody)
    return request.data
  },{
    onSuccess: () => {
      setNextPopup(true)
      setOpen(false)
    }
  })
  
  const ConclusionConsultaDeleteHorario = useMutation(async(valueBody) =>{
    const request = await axios.post(`${config.apiBaseUrl}/api/conclusion-consulta-delete-horario`, valueBody)
    return request.data
  })

  const HandleNextPopup = async () => {

    const body2 ={
       id: id,
       IdentificadorConsulta: IdentificadorConsulta,
       FichaPaciente: ficha,
       Diagnostico: Diagnóstico,
       Tratamento: Tratamento,
       FerramentaTerapeutica: FerramentaTerapeutica,
       Progresso: Progresso,
       SolicitacaoMateriais: SolicitaçaoMateriais,
       RecomendacoesFuturas: Recomendacoes,
       EstadoPaciente: estado,
       CRMMedicoAtendeu: CRMMedico,
       DataInsercao: date
     }

      await SavedConsulta.mutateAsync(body2)

      await ConclusionConsultaDeleteHorario.mutateAsync({ idConsultaParticular: IdentificadorConsulta })
  }

  return (
    <>
    <Dialog open={open} onClose={handleClose}>
      <div className='flex flex-col justify-center items-center'>
        <div className='pt-6'>
          <Image
            src={Logo2}
            alt='Segundo Logo Interconsulta'
            width={200}
            height={100}
          />
        </div>
          <DialogTitle className='text-red-600 font-bold'>{nomeMedico}</DialogTitle>
          <DialogContent>
             <p className='font-bold'> Após clicar abaixo em Finalizar a consulta voce sera direcionado para a geração de Documentos da sua consulta com o Paciente {nomePaciente} a consulta de voces realmente ja se encerrou para a realização de tal Atividade?</p>
          </DialogContent>

          <div className='flex justify-center items-center w-full flex-col gap-3'>
          <button 
          onClick={() => HandleNextPopup()} 
          disabled={SavedConsulta.isLoading}    
          className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
          {SavedConsulta.isLoading ?
              <CircularProgress size={24}/>:
              <p className="sm:text-sm text-center"> Finalizar a consulta e Gerar Documentos </p> 
          }
         </button>
         <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
               <p className="whitespace-nowrap"> Voltar a Consulta </p>
         </button>
          </div>

        </div>
       <div className="flex justify-end p-4">
            <Image
              src={Logo}
              alt="Logo Interconsulta"
              height={40}
              width={40}
              className='animate-spin-slow'
            />
          </div>
      </Dialog>

      {nextPopup &&
        <Documents
          onClose={() => setNextPopup(false)}
          ReceitaSimpleS={ReceitaSimpleS}
          ReceitaControlada={ReceitaControlada}
          diasAfastamento={diasAfastamento}
          SolicitarExames={SolicitarExames}
          nomePaciente={nomePaciente}
          nomeMedico={nomeMedico}
          CRMMedico={CRMMedico}
          UFMedico={UFMedico}
          EstadoMedico={EstadoMedico}
          BairroMedico={BairroMedico}
          CidadeMedico={CidadeMedico}
          CPFPaciente={CPFPaciente}
          EnderecoMedico={EnderecoMedico}
          CID={CID}
          CidadePaciente={CidadePaciente}
          EstadoPaciente={EstadoPaciente}
          CPFMedico={CPFMedico}
          EnderecoPaciente={EnderecoPaciente}
          IdentificadorConsulta={IdentificadorConsulta}
          date={date}
          hora={hora}
       /> 
      }
    </>
  );
}

