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

const ObrigadoMedico = () =>{
  
  const [nomePaciente, setNomePaciente] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [fotoPaciente, setFotoPaciente]  = useState(null)
  const fileInputRef = useRef(null);


  const NomeMedicoLocal = secureLocalStorage.getItem('NomeMedico')
  const id = secureLocalStorage.getItem('EndMedico')
  const NomeMedico = NomeMedicoLocal || ''

  const router = useRouter()

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
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
