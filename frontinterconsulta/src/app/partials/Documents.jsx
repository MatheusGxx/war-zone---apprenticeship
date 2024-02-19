import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import React, { forwardRef, useState, useEffect } from 'react';
import { 
  Dialog,
  AppBar, 
  Toolbar, 
  Slide,
} from '@mui/material'

import { SolicitaçaoExames }  from '../components/SolicitaçaoExames'
import { AtestadoDoctor } from '../components/Atestado'
import { ReceitaSimples } from '../components/ReceitaSimples'
import { ReceitaControladA } from '../components/ReceitaControlada';
import Image from 'next/image';
import Logo from '../public/logo.png';
import Logo2 from '../public/Logo2.png'
import { useMutation } from '@tanstack/react-query'
import { config  } from '../config';
import axios from 'axios'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import CloseIcon from '@mui/icons-material/Close'
import { useReceitaSimples } from '../context/context'
import { useReceitaControlada } from '../context/context'
import { useAtestado } from '../context/context'
import { useExame } from '../context/context'
import { GenerateDocuments } from './GenerateDocumentsDialog'
 
export const Documents = ({ 
    onClose, 
    diasAfastamento, 
    ///////////////
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
    CPFMedico,
    EnderecoPaciente,
    IdentificadorConsulta,
    date,
    hora
    
    }) => {

    const [open, setOpen] = useState(false)
    const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0)
    const [warningDoctor, setWarningDoctor] = useState(false)

    const [documents, setDocuments] = useState([])

   
    const Transition = forwardRef(function Transition(props, ref) {
      return <Slide direction="left" ref={ref} {...props} />;
    })

    useEffect(() => {
      handleClickOpen()
    }, [])

  
    useEffect(() => {

    },[warningDoctor, documents])

    const handleClickOpen = () => setOpen(true);


    const getDocuments = useMutation(async (valueBody) => { 
        try {
          const response = await axios.post(`${config.apiBaseUrl}/api/verify-documents`, valueBody);
          const consulta = response.data.consulta;
      
          const exames = consulta[0].ExameSolicitado
          if(exames.length > 0){
            setDocuments(prevDocuments => [
              ...prevDocuments,
              <SolicitaçaoExames
                date={date}
                nomePaciente={nomePaciente}
                nomeMedico={nomeMedico}
                CRMMedico={CRMMedico}
                EnderecoMedico={EnderecoMedico}
                IdentificadorConsulta={IdentificadorConsulta}
                exames={exames}
              />
            ]);
          }
          const receitaSimples = consulta[0].ReceitasSimples

          if(receitaSimples.length > 0){
            setDocuments(prevDocuments => [
              ...prevDocuments,
              <ReceitaSimples
                NomePaciente={nomePaciente}
                CPFPaciente={CPFPaciente}
                Endereço={EnderecoMedico}
                NomeMedico={nomeMedico}
                CRM={CRMMedico}
                UF={UFMedico}
                date={date}
                HoraAtual={hora}
                receitaS={receitaSimples}
              />
            ]);
          }
          const receitaControlada = consulta[0].ReceitasControlada

          if(receitaControlada.length > 0){
            setDocuments(prevDocuments => [
              ...prevDocuments,
              <ReceitaControladA
                Endereço={EnderecoMedico}
                NomeMedico={nomeMedico}
                CRM={CRMMedico}
                UF={UFMedico}
                CidadeMedico={CidadeMedico}
                NomePaciente={nomePaciente}
                EnderecoPaciente={EnderecoPaciente}
                CPFPaciente={CPFPaciente}
                date={date}
                receitaC={receitaControlada}
              />
            ]);
          }
          const Atestado = consulta[0].Atestado

          if(Atestado.length > 0){
            setDocuments(prevDocuments => [
              ...prevDocuments,
              <AtestadoDoctor
                NomeMedico={nomeMedico}
                CRMMedico={CRMMedico}
                NomePaciente={nomePaciente} 
                CPFPaciente={CPFPaciente}
                DiasAfastamento={diasAfastamento} 
                CID={CID}
                Localidade={EnderecoMedico}
                date={date}
                atestado={Atestado}
          
              />
            ]);
          }
      
          return consulta;
        } catch(error) {
          console.log(error);
        }
      })

   
    useEffect(() => {
      getDocuments.mutate({ id: IdentificadorConsulta})
    },[])

    const handleClose = () => {
        setOpen(false)
        onClose()
    };

    const handleNextDocument = () => {
        setSelectedDocumentIndex((prevIndex) => (prevIndex + 1) % documents.length);
    };

    const handlePreviousDocument = () => {
        setSelectedDocumentIndex((prevIndex) => (prevIndex - 1 + documents.length) % documents.length)
    }

    const HandleVerifyDoctorDocument = () => {
      setWarningDoctor(true)
    }

    return (
        <Dialog 
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: 'white' }}>
            <Toolbar>
              <CloseIcon
                edge="start"
                color="primary"
                onClick={handleClose}
                aria-label="close"
                className="cursor-pointer"
              />
               <div className='flex justify-center items-center flex-grow gap-3'>
                <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className='animate-spin-slow'/>
              </div>
            </Toolbar>
          </AppBar>
              
              <div className="flex justify-center items-center mt-10">
              <ArrowBackIosNewRoundedIcon 
                 color="primary" 
                 className='cursor-pointer' 
                 onClick={handlePreviousDocument}
               />
               <button className='p-2 bg-blue-700 rounded-full w-1/2' onClick={HandleVerifyDoctorDocument}>
               <p className='text-white font-bold'> Gerar Documentos!  </p> 
               </button>
                <ArrowForwardIosIcon 
                  color="primary" 
                  className="cursor-pointer" 
                  onClick={handleNextDocument}
               />
              </div>

              {warningDoctor && 
               <GenerateDocuments
               onClose={() => setWarningDoctor(false)}
               nomePaciente={nomePaciente}
               />
              }

                  <div className='flex justify-center items-center w-full mb-10'>
                  {documents.length > 0 ? 
                       documents[selectedDocumentIndex] :
                       <>
                       <div className='flex justify-center items-center gap-3 min-h-[70vh] sm:flex sm:flex-col'>
                        <h1 className="font-bold text-blue-500 text-center text-2xl"> {nomeMedico} Voce nao preencheu nenhum Documento </h1>
                        <SentimentVeryDissatisfiedIcon color="primary" fontSize='large'/>
                       </div>
                       </>
                    }
                  </div>

        </Dialog>
    );
};
