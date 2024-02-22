import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import secureLocalStorage from 'react-secure-storage'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { config } from '../config'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

import { useReceitaSimples } from '../context/context'
import { useReceitaControlada } from '../context/context'
import { useAtestado } from '../context/context'
import { useExame } from '../context/context'
import { useRouter } from 'next/navigation'

export const GenerateDocuments = ({ onClose, nomePaciente }) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(null)

  useEffect(() => {
    setOpen(true)
  }, [])
  
  useEffect(() => {
    const ObjectDate = new Date()

    const Dia = ObjectDate.getDate()
    const Mes = ObjectDate.getMonth() + 1
    const Ano = ObjectDate.getFullYear()
  
    const DataAtual = `${Dia}/${Mes}/${Ano}`
    setDate(DataAtual)
  },[date])


  const Router = useRouter()
  const IdentificadorConsulta = secureLocalStorage.getItem('ConsultaPacienteParticular')
  const id = secureLocalStorage.getItem('id')

  const { receitaSimples } = useReceitaSimples()
  const { receitaControlada } = useReceitaControlada()
  const { atestado } = useAtestado()
  const { exame } = useExame() 

  const SaveDocuments = useMutation(async(valueBody) =>{
    try{
      const request = await axios.post(`${config.apiBaseUrl}/api/atualized-documents`, valueBody)
      return request.data
    }catch(error){
      console.log(error)
    }
 })


 const RequestCreateDocuments = useMutation(async (valueRequest) => {
  try {
    const response = await axios.post(`${config.apiBaseUrl}/api/create-documents-doctor`, valueRequest)
    return response.data.files
  } catch (error) {
    console.error('Erro ao criar documentos:', error)
    throw error // Re-throw o erro para que possa ser capturado por quem chama essa função
  }
}, {
  onSuccess: () => {
    secureLocalStorage.setItem('EndMedico', IdentificadorConsulta)
    secureLocalStorage.removeItem('ConsultaPacienteParticular')
    Router.push('/obrigado')
  }
})

 const HandleSaveDocuments = async () => {
    await SaveDocuments.mutateAsync({ receitaSimples, receitaControlada, atestado, exame, IdentificadorConsulta })

    const body3 = {
       idMedico: id,
       IdentificadorConsultaPaciente: IdentificadorConsulta,
     }
     
     const files = await RequestCreateDocuments.mutateAsync(body3)
     
     // Cria um novo objeto JSZip
     const zip = new JSZip()

     // Promise.all para esperar que todos os arquivos sejam adicionados ao zip
     await Promise.all(files.map(async (fileUrl) => {
       const response = await axios.get(`${config.apiBaseUrl}${fileUrl}`, {
         responseType: 'blob',
       })

       // Adiciona o arquivo ao zip
       zip.file(fileUrl.split('/').pop(), response.data);
     }))

     // Gera o conteúdo do arquivo zip
     const zipContent = await zip.generateAsync({ type: 'blob' });

     // Salva o arquivo zip
     saveAs(zipContent, `Documentos_do_Paciente_${nomePaciente}_${date}.zip`)

 }

 const handleClose = () => {
  HandleSaveDocuments()
}

 const HandleClose2 = () => {
  onClose()
  setOpen(false)
 }
  

  const NomeMedico = secureLocalStorage.getItem('NomeMedico')

  return (
    <>
    <Dialog open={open} onClose={HandleClose2} className='p-10'>
      <div className='flex flex-col justify-center items-center'>
        <div className='pt-6'>
          <Image
            src={Logo2}
            alt='Segundo Logo Interconsulta'
            width={200}
            height={100}
          />
        </div>
          <DialogTitle className='text-red-600 font-bold'>Atençao!!!</DialogTitle>
          <DialogContent>
             <h1> Atenção!!! {NomeMedico}, apos clicar em Gerar todos os documentos para o paciente {nomePaciente}, preenchidos por voce iram ser gerados sendo assim irreversivel altera-los antes de gerar tenha certeza que esta tudo em ordem! </h1>
          </DialogContent>

          <div className='flex flex-col justify-center items-center gap-3 w-full'>

          <button onClick={handleClose} 
          className="w-11/12 h-12 rounded-full bg-blue-600 text-white font-bold"
          disabled={RequestCreateDocuments.isLoading}
          >
               <p className="whitespace-nowrap"> 
               {RequestCreateDocuments.isLoading ?
                `Gerando documentos para ${nomePaciente}`
                :
                `Gerar documentos para ${nomePaciente}`}
               </p>
          </button>

          <button 
          onClick={HandleClose2}
          disabled={SaveDocuments.isLoading && RequestCreateDocuments.isLoading}
          className="w-11/12 h-12 rounded-full bg-blue-600 text-white font-bold">
               <p className="whitespace-nowrap"> Voltar a Edição </p>
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
    </>
  )
}

