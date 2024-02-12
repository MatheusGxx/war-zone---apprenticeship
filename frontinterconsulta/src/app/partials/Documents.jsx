import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useState, useEffect } from 'react'; 
import { Dialog, DialogContent, DialogActions } from '@mui/material'
import { SolicitaçaoExames } from '../components/SolicitaçaoExames'
import { AtestadoDoctor } from '../components/Atestado'
import { ReceitaSimples } from '../components/ReceitaSimples'
import { ReceitaControladA } from '../components/ReceitaControlada';
import Image from 'next/image';
import Logo from '../public/logo.png';
import Logo2 from '../public/Logo2.png'
import { useMutation } from '@tanstack/react-query'
import { config  } from '../config';
import axios from 'axios'
import { useAtestado } from '../context/context.js'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
 
export const Documents = ({ 
    onClose, 
    ReceitaSimpleS,
    ReceitaControlada, 
    diasAfastamento, 
    SolicitarExames,
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
    }) => {

    const [open, setOpen] = useState(false)
    const [date, setDateNow] = useState(null)
    console.log(date)
    const [hora, setHoraAtual] = useState(null)
    console.log(hora)
    const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0)
    const { atestado } = useAtestado()

    const [documents, setDocuments] = useState([])

    useEffect(() => {
        setOpen(true)
    }, [atestado, documents])

    useEffect(() => {
        const DateNow = new Date();

        const Dia = DateNow.getDate();
        const Mes = DateNow.getMonth() + 1;
        const Ano = DateNow.getFullYear();

        const DataAtual = `${Dia}/${Mes}/${Ano}`;
        setDateNow(DataAtual);

        const Horas = DateNow.getHours();
        const Minutos = DateNow.getMinutes();
        const Segundos = DateNow.getSeconds();

        const HoraAtual = `${Horas}:${Minutos}:${Segundos}`;
        setHoraAtual(HoraAtual);
    },[date, hora])

    const getDocuments = useMutation(async (valueBody) => { 
        try {
          const response = await axios.post(`${config.apiBaseUrl}/api/verify-documents`, valueBody);
          const consulta = response.data.consulta;
          console.log(consulta)
      
          const exames = consulta[0].ExameSolicitado
          if(exames.length > 0){
            setDocuments(prevDocuments => [
              ...prevDocuments,
              <SolicitaçaoExames
                date={date}
                nomePaciente={nomePaciente}
                nomeMedico={nomeMedico}
                CRMMedico={CRMMedico}
                UFMedico={UFMedico}
                EstadoMedico={EstadoMedico}
                BairroMedico={BairroMedico}
                CidadeMedico={CidadeMedico}
                IdentificadorConsulta={IdentificadorConsulta}
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
              />
            ]);
          }
          const Atestado = atestado

          if(Atestado === true){
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
    },[date, hora])

    const handleClose = () => {
        setOpen(false)
        onClose()
    };

    const handleNextDocument = () => {
        setSelectedDocumentIndex((prevIndex) => (prevIndex + 1) % documents.length);
    };

    const handlePreviousDocument = () => {
        setSelectedDocumentIndex((prevIndex) => (prevIndex - 1 + documents.length) % documents.length)
    };

    return (
        <Dialog 
            open={open} 
            PaperProps={{
                style: {
                    maxWidth: '1250px', 
                    width: '100%',
                    height: '100%',
                    maxHeight: '1000px'
                },
            }}
            onClose={handleClose}
        >
            <div className='flex flex-col justify-center items-center'>
                <div className='pt-6'>
                    <Image
                        src={Logo2}
                        alt='Segundo Logo Interconsulta'
                        width={200}
                        height={100}
                    />
                </div>
            </div>

            <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='container'>
               
                  {documents.length > 0 ? 
                       documents[selectedDocumentIndex] :
                       <>
                       <div className='flex justify-center items-center gap-3'>
                        <h1 className="font-bold text-blue-500 text-center text-2xl"> {nomeMedico} Voce nao preencheu nenhum Documento </h1>
                        <SentimentVeryDissatisfiedIcon color="primary" fontSize='large'/>
                       </div>
                       </>
                    }
               
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center', width: '100%'}}>
            <ArrowBackIosNewRoundedIcon 
                        color="primary" 
                        className='cursor-pointer' 
                        onClick={handlePreviousDocument}
            />
                <button className='p-2 bg-blue-700 rounded-full w-1/2'>
                    <p className='text-white font-bold'> Gerar Documentos!  </p> 
                </button>
                <ArrowForwardIosIcon 
                        color="primary" 
                        className="cursor-pointer" 
                        onClick={handleNextDocument}
              />
            </DialogActions>

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
    );
};
