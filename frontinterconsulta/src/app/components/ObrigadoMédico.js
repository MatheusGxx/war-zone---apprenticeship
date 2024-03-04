'use client'
import Image from "next/image"
import Logo from '../public/logo.png'
import secureLocalStorage from 'react-secure-storage'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { config } from "../config"
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import CloseIcon from '@mui/icons-material/Close'
import Logo2 from '../public/Logo2.png'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Api2 } from "../config"
import SemFoto from '../public/SemFoto.jpg'
import { useRouter } from "next/navigation";

const ObrigadoMédico = () =>{
  
  const [nomePaciente, setNomePaciente] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [fotoPaciente, setFotoPaciente]  = useState(null)
  const fileInputRef = useRef(null);


  const NomeMedicoLocal = secureLocalStorage.getItem('NomeMedico')
  const id = secureLocalStorage.getItem('EndMedico')
  const NomeMedico = NomeMedicoLocal || ''

  const Router = useRouter()

  const handleFileChange = () => {
    const files = Array.from(fileInputRef.current.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files])
  }

  const handleRemoveFile = (index) => {
    const newSelectedFiles = selectedFiles.filter((file, i) => i !== index);
    setSelectedFiles(newSelectedFiles);
  }
  
  const handleButtonClick = () => {
    fileInputRef.current.click();
  }

  useEffect(() => {
    console.log(selectedFiles)
  },[selectedFiles])

  const sendDocumentsPatient = useMutation(
    async (value) => {
      try {
        const response = await axios.post(`${Api2.apiBaseUrl}/api2/send-documents-patient`, value);
        return response.data; 
      } catch (error) {
        console.error('Error during mutation:', error);
        throw error;
      }
    }
  )

  const getDataPatient = useMutation(
    async (value) => {
      try {
        const response = await axios.post(`${config.apiBaseUrl}/api/data-patient`, value)
        setNomePaciente(response.data.NomePaciente)
        return response.data
      } catch (error) {
        console.error('Error during mutation:', error);
        throw error;
      }
    }
  )

  useEffect(() => {
      getDataPatient.mutateAsync({ id: id })
  },[])


  const HandleSendFiles = async () => {
    const formData = new FormData()
    
    formData.append('id', id)
    selectedFiles.forEach((file, index) => {
      formData.append(`file`, file);
    });
    
    try{
      await sendDocumentsPatient.mutateAsync(formData)
      Router.push('/agenda')
      secureLocalStorage.removeItem('EndMedico')      
    }catch(err){
      console.log(err)
    }

  }

  return(
    <>


     <div className='flex pt-2 w-full min-h-screen gap-5 flex-col'>

     <div className='flex justify-center mt-10'>
            <Image
                src={Logo2}
                alt="Logo2"
                height={10}
                width={400}
                />
          </div>

     <div className='flex flex-col gap-10 justify-center items-center'>

      {selectedFiles.length > 0 ? 
      null :
       <h1 className="font-bold text-4xl leading-tight sm:text-center md:text-center lg:text-center xl:text-center text-center">
         {NomeMedico} Mande os Documentos assinados <br/> para o paciente {nomePaciente}
       </h1>
       }
     
        <div className="sm:flex sm:jucenter sm:items-center md:stify-flex justify-center md:items-center lg:flex lg:justify-center lg:items-center xl:flex xl:justify-center xl:items-center w-full flex flex-col gap-3 items-center">
         
        {getDataPatient.isSuccess && 
        getDataPatient.data.FotoPaciente ? 
        <Image src={`${config.apiBaseUrl}/${getDataPatient.data.FotoPaciente}`} alt="Foto Paciente" width={100} height={100}/>
        : 
        <Image src={SemFoto} alt="Paciente sem Foto" width={100} height={100} className="rounded-lg"/>
        }
        
        <div className="flex justify-center shadow-lg gap-3 cursor-pointer p-5 rounded-full" onClick={handleButtonClick}> 
            <UploadFileIcon color="primary"/>
            <p className="font-bold text-blue-500 "> Selecionar Documentos Assinados para o Paciente {nomePaciente}</p>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} multiple />

        <div className="flex flex-col gap-5">
        {selectedFiles.length > 0 && (
            <ul>
            <div className="flex gap-5 mt-5 flex-col">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex gap-5">
                <div className="flex gap-5 border-blue-500 bg-indigo-950 border-2 rounded-lg p-2 w-full">
                  <PictureAsPdfIcon color="primary" />
                  <li key={index} className="font-bold text-blue-500">{file.name}</li>
                  <CloseIcon color="primary" className="cursor-pointer" fontSize="medium" onClick={() => handleRemoveFile(index)} />
                </div>
              </div>
            ))}
          </div>
            </ul>
        )}
        </div>
      </div>

     </div>

     <div className="flex items-end justify-center">
        {selectedFiles.length > 0 && 
        <div className="flex justify-center shadow-lg gap-3 cursor-pointer p-5 rounded-full" onClick={HandleSendFiles}> 
            <KeyboardTabIcon color="primary"/>
            <p className="font-bold text-blue-500 "> Enviar Documentos para o Paciente {nomePaciente}</p>
        </div>
        }
        </div>
    </div>

    </>
  )
}

export default ObrigadoMédico