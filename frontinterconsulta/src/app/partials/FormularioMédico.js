'use client'
import { useState, useEffect } from "react";
import { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, Snackbar , Alert } from "@mui/material"
import Logo2 from '../public/Logo2.png'
import Logo from '../public/logo.png'
import Image from "next/image"; 
import { useMutation } from '@tanstack/react-query'
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { RegisterOneDoctor } from '../partials/RegisterOneDoctor.jsx'
import { RegisterTwoDoctor } from '../partials/RegisterTwoDoctor.jsx'
import { RegisterTreeDoctor } from "./RegisterTreeDoctor.jsx"
import { RegisterFourDoctor } from "./RegisterFourDoctor.jsx";
import { RegisterFiveDoctor } from './RegisterFiveDoctor.jsx'
import { RegisterSixDoctor } from './RegisterSixDoctor.jsx'
import { RegisterMédicoSeven } from './RegisterDoctorSeven.jsx'
import { config } from '../config.js'

const FormularioMédico = () => {
  const [open, setOpen] = useState(false);
  const hiddenFileInput = useRef(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [foto, setFoto] = useState(null)

  const [nome, setNome] = useState('')
  const [titulo, setTitulo] = useState('')
  const [formacao, setFormacao] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [atuacao, setAtuacao] = useState('')
  const [crm, setCRM] = useState('')
  const [ufCRM, setUFCRM] = useState('')
  const [rqe, setRQE] = useState('')
  const [certificacao, setCertificacao] = useState('')
  const [resumo, setResumo] = useState('')
  const [precoConsulta, setPrecoConsulta] = useState('')
  const [posGraducao, setPosGraduacao] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [ferramentaTerapeutica, setFerramentasTerapeuticas] = useState([])
  const [anograduacao,setAnoGraduacao] = useState('')
  const [instituicaoResidencia,setInstituicaoResidencia] = useState('')
  const [nometitular, setNomeTitular] = useState('')
  const [numeroconta, setNumeroConta] = useState('')
  const [numeroAgencia, setNumeroAgencia] = useState('')
  const [banco, setBanco] = useState('')
  const [pix, setPix] = useState('')
  const [cnpjMedico, setCPNJMedico] = useState('')
  const [cpfMedico, setCPFMedico] = useState('')
  const [razaoSocialEmpresa, setRazaoSocialEmpresa] = useState('')
  const [nomeFantasia, setNomeFantasia] = useState('')
  const [enderecoMedico, setEnderecoMedico] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [cepMedico, setCEPMedico] = useState('')
  const [emailContador, setEmailContador] = useState('')
  const [numeroContador, setNumeroContador] = useState('')
  const [typeDoctor, setTypeDoctor] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [croppedImage, setCroppedImage] = useState(null)
  const [croppedFile, setCroppedFile] = useState(null)
  const [typeDoctorPublic, setTypeDoctorPublic] = useState(false)

  useEffect(() => {

  },[typeDoctorPublic])

  const Params = useSearchParams()

  const parametrer = Params.get('id')

  const Router = usePathname()

  const NavegationPage = useRouter()

  const CreateRequestMutation  = useMutation( async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/obrigado/${parametrer}`, valueRequest)
    return response.data
  },{
    onSuccess:(data) =>{
      const { token, NomeMedico, AreaAtuacao, CRMM, FotoMedico, TypeDoctorr } = data
      secureLocalStorage.setItem('token', token)
      secureLocalStorage.setItem('id', parametrer)
      secureLocalStorage.setItem('NomeMedico', NomeMedico)
      secureLocalStorage.setItem('AreadeAtuacao', AreaAtuacao)
      secureLocalStorage.setItem('CRMMedico', CRMM)
      secureLocalStorage.setItem('FotoMedico', FotoMedico)
      secureLocalStorage.setItem('TypeDoctor', TypeDoctorr)
    }
  })

  const getListDoencasDoctor = useMutation( async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/saved-list-doencas-and-photo-especiality`, valueRequest)
    return response.data
  })

  useEffect(() => {
    if(especialidade !== ''){
      getListDoencasDoctor.mutateAsync({ Especialidade: especialidade, id: parametrer})
    }
  },[especialidade])

  const handleOpenClick = () => {
    setOpen(true);
  }

  const HandleClickFinal = async () => {
    const formData = new FormData();
    formData.append("NomeConhecido", nome)
    formData.append("TituloEspecialista", titulo)
    formData.append("FormacaoEspecialista", formacao)
    formData.append('AnoGraduacao', anograduacao)
    formData.append("PosGraduacao", posGraducao )
    formData.append("EspecialidadeMedica", especialidade)
    formData.append("AreadeAtuacao", atuacao);
    formData.append("CRM", crm)
    formData.append("UFCRM", ufCRM)
    formData.append('InstituicaoResidencia', instituicaoResidencia)
    formData.append("DataNascimento", dataNascimento)
    formData.append("RQE", rqe);
    formData.append("Certificacao", certificacao)
    formData.append("PrecoConsulta", precoConsulta)
    formData.append("ResumoProfissional", resumo)
    formData.append("FerramentasTerapeuticas", ferramentaTerapeutica)
    formData.append("Slug", nome)
    formData.append("NomeTitular", nometitular)
    formData.append("NumeroConta", numeroconta)
    formData.append("NumeroAgencia", numeroAgencia)
    formData.append("Banco", banco)
    formData.append("ChavePix", pix)
    formData.append('CPNJMedico', cnpjMedico)
    formData.append('RazaoSocialEmpresa', razaoSocialEmpresa)
    formData.append('NomeFantasia', nomeFantasia)
    formData.append('EnderecoMedico', enderecoMedico )
    formData.append('Bairro', bairro)
    formData.append('Cidade', cidade)
    formData.append('Estado', estado)
    formData.append('CEPMedico', cepMedico)
    formData.append('EmailContador', emailContador),
    formData.append('TelefoneContador', numeroContador)
    formData.append('TypeDoctor', typeDoctor)
    formData.append("route", Router)
    formData.append("file", croppedFile)

    try {
      await CreateRequestMutation.mutateAsync(formData)
      NavegationPage.push(`/casos-clinicos`)
    } catch (err) {
      setSnackbarMessage(
        'Ops Algo deu errado :(, parece que você não fez o primeiro cadastro, volte e faça o primeiro cadastro'
      );
      handleSnackBarOpen();
    }
  }

  const HandleClickEnd = () =>{
      HandleClickFinal()
    
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  };

  const handleSnackBarOpen = () =>{
    setSnackbarOpen(true)
  }


  return (
    <>
      <button onClick={() => handleOpenClick()} className="w-72 h-12 rounded-full bg-indigo-950 text-white font-light">
           Finalizar Cadastro
      </button>
     
        <Dialog open={open}
         PaperProps={{
          style: {
            maxWidth: '600px', 
            width: '100%',
          },
        }}
        >
        <div className="flex justify-center">
          <DialogTitle>
            <Image
            src={Logo2}
            alt="Logo 2 Interconsulta"
            height={200}
            width={220}
            />
          </DialogTitle>
          </div>
            <DialogContent className="w-full">
                <div className="flex flex-col gap-3">

                {currentStep === 1 &&
                // Informaçoes Pessoais do Médico
                  <RegisterOneDoctor
                  titulo={titulo}
                  setTitulo={setTitulo}
                  setNome={setNome}
                  nome={nome}
                  setDataNascimento={setDataNascimento}
                  dataNascimento={dataNascimento}
                  setTypeMedico={setTypeDoctor}
                  typeMedico={typeDoctor}
                  setCurrentStep={setCurrentStep}
                  setTypeDoctorPublic={setTypeDoctorPublic}
                  />
                }

                {currentStep === 2 &&
                //Especialidade Médica Principal
                  <RegisterTwoDoctor
                   especialidade={especialidade}
                   setEspecialidade={setEspecialidade}
                   atuacao={atuacao}
                   setAtuacao={setAtuacao}
                   setResumo={setResumo}
                   resumo={resumo}
                   setCurrentStep={setCurrentStep}
                   typeDoctorPublic={typeDoctorPublic}
                   />
                }

                {currentStep === 3 &&  
                //Ferramentas Terapeuticas
                    <RegisterTreeDoctor 
                    setFerramentasTerapeuticas={setFerramentasTerapeuticas}
                    setCurrentStep={setCurrentStep}
                    />
                }
                
                {currentStep === 4 && 
                //Formaçao Médica
                    <RegisterFourDoctor
                    setFormacao={setFormacao}
                    formacao={formacao}
                    setAnoGraduacao={setAnoGraduacao}
                    anograduacao={anograduacao}
                    setCRM={setCRM}
                    crm={crm}
                    setUFCRM={setUFCRM}
                    ufCRM={ufCRM}
                    setInstituicaoResidencia={setInstituicaoResidencia}
                    instituicaoResidencia={instituicaoResidencia}
                    setRQE={setRQE}
                    rqe={rqe}
                    setPosGraduacao={setPosGraduacao}
                    posGraducao={posGraducao}
                    certificacao={certificacao}
                    setCertificacao={setCertificacao}
                    setCurrentStep={setCurrentStep}
                    />
                }
                {currentStep === 5  &&
                //Preferencias de Pagamento
                    <RegisterFiveDoctor 
                      setPrecoConsulta={setPrecoConsulta}
                      precoConsulta={precoConsulta}
                      setNomeTitular={setNomeTitular}
                      nometitular={nometitular}
                      setNumeroConta={setNumeroConta}
                      numeroconta={numeroconta}
                      setNumeroAgencia={setNumeroAgencia}
                      numeroAgencia={numeroAgencia}
                      setBanco={setBanco}
                      banco={banco}
                      setPix={setPix}
                      pix={pix}
                      setCurrentStep={setCurrentStep}
                    />
                }
                {currentStep === 6 && 
                 //Ficha de Cadastro
                    <RegisterSixDoctor
                      setCPNJMedico={setCPNJMedico}
                      cnpjMedico={cnpjMedico}
                      setCPFMedico={setCPFMedico}
                      cpfMedico={cpfMedico}
                      setRazaoSocialEmpresa={setRazaoSocialEmpresa}
                      razaoSocialEmpresa={razaoSocialEmpresa}
                      setNomeFantasia={setNomeFantasia}
                      nomeFantasia={nomeFantasia}
                      setEnderecoMedico={setEnderecoMedico}
                      enderecoMedico={enderecoMedico}
                      setBairro={setBairro}
                      bairro={bairro}
                      setCidade={setCidade}
                      cidade={cidade}
                      setEstado={setEstado}
                      estado={estado}
                      setCEPMedico={setCEPMedico}
                      cepMedico={cepMedico}
                      setEmailContador={setEmailContador}
                      setNumeroContador={setNumeroContador}
                      emailContador={emailContador}
                      numeroContador={numeroContador}
                      setCurrentStep={setCurrentStep}
                    />
                }

                {currentStep === 7 && 
                //Foto Médico
                <RegisterMédicoSeven
                 hiddenFileInput={hiddenFileInput}
                 setFoto={setFoto}
                 Foto={foto}
                 HandleClickEnd={()  =>  HandleClickEnd()}
                 CreateRequestMutation={CreateRequestMutation}
                 setCroppedImage={setCroppedImage}
                 croppedImage={croppedImage}
                 setCroppedFile={setCroppedFile}
                 croppedFile={croppedFile}
                />
                }
                </div>
            </DialogContent>
        
          <div className="flex justify-end p-4">
            <Image
            src={Logo}
            alt="Logo Interconsulta"
            height={40}
            width={40}
            className="animate-spin-slow"
            />
          </div>
        </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Tempo em milissegundos que o Snackbar será exibido
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormularioMédico;


