import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import GenerateDocuments from './GenerateDocumentsDialog';
import {
  Dialog,
  AppBar,
  Toolbar,
  Slide,
} from '@mui/material'
import DocumentsEscolhidos from '../components/DocumentsEscolhidos';
import { AtestadoDoctor, ReceitaSimples, ReceitaControladA } from '../components/DocumentComponents';
import Image from 'next/image';
import Logo from '../public/logo.png';
import Logo2 from '../public/Logo2.png'
import { useMutation } from '@tanstack/react-query';
import { config } from '../config';
import axios from 'axios'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const Documents = ({
  onClose,
  diasAfastamento,
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
  const [open, setOpen] = useState(false);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
  const [warningDoctor, setWarningDoctor] = useState(false);
  const [documents, setDocuments] = useState([]);

  const getDocuments = useMutation(async (valueBody) => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/verify-documents`, valueBody);
      const consulta = response.data.consulta;

      const exames = consulta[0].ExameSolicitado;
      const receitaSimples = consulta[0].ReceitasSimples;
      const receitaControlada = consulta[0].ReceitasControlada;
      const Atestado = consulta[0].Atestado;

      setDocuments(prevDocuments => [
        ...prevDocuments,
        {
          component: <DocumentsEscolhidos
            date={date}
            nomePaciente={nomePaciente}
            nomeMedico={nomeMedico}
            CRMMedico={CRMMedico}
            EnderecoMedico={EnderecoMedico}
            UF={UFMedico}
            HoraAtual={hora}
            CPFPaciente={CPFPaciente}
            CidadeMedico={CidadeMedico}
            EnderecoPaciente={EnderecoPaciente}
            exames={exames}
            receitaS={receitaSimples}
            receitaC={receitaControlada}
            atestado={Atestado}
          />,
          type: 'DocumentsEscolhidos'
        }
      ]);

      return consulta;
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    getDocuments.mutate({ id: IdentificadorConsulta });
  }, [IdentificadorConsulta]);

  useEffect(() => {
    if (warningDoctor && documents.length > 0) {
      setSelectedDocumentIndex(0);
    }
  }, [warningDoctor]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const HandleVerifyDoctorDocument = () => {
    setWarningDoctor(true);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', backgroundColor: 'white' }}>
        <Toolbar>
          <div className='flex justify-center items-center flex-grow gap-3'>
            <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className='animate-spin-slow' />
          </div>
        </Toolbar>
      </AppBar>

      {warningDoctor && (
        <GenerateDocuments
          onClose={() => setWarningDoctor(false)}
          nomePaciente={nomePaciente}
        />
      )}

      <div className='flex justify-center items-center w-full mb-10'>
        {documents.length > 0 ? (
          documents[selectedDocumentIndex].component
        ) : (
          <>
            <div className='flex justify-center items-center gap-3 min-h-[70vh] sm:flex sm:flex-col'>
              <h1 className="font-bold text-blue-500 text-center text-2xl"> {nomeMedico} Voce
