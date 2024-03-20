'use client'
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogActions, DialogTitle, TextField , Snackbar , Alert, CircularProgress } from "@mui/material";
import Logo2 from '../public/Logo2.png';
import Logo from '../public/logo.png';
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams, useRouter, usePathname} from 'next/navigation'
import secureLocalStorage from 'react-secure-storage';
import { config } from '../config.js'

const FormularioUnidade = () => {
  const [open, setOpen] = useState(false);
  const hiddenFileInput = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoError, setFotoError] = useState(false);
  
  const [endereco, setEndereco] = useState('');

  const [nome, setNome] = useState('');
  const [cpnj, setCPNJ] = useState('');
  const [especialidade, setEspecialidade] = useState('');

  const Params = useSearchParams()

  const parametrer = Params.get('id')

  const Router = usePathname()

  const NavegationPage = useRouter()
   
  const CreateRequestMutation = useMutation( async (valueRequest) =>{
    const response = await axios.post(`${config.apiBaseUrl}/api/obrigado/${parametrer}`, valueRequest)
    return response.data
  },{
    onSuccess:(data) =>{
      const { token, NomeUnidade, FotoUnidade } = data
      secureLocalStorage.setItem('token', token)
      secureLocalStorage.setItem('id', parametrer)
      secureLocalStorage.setItem('NomeUnidade', NomeUnidade)
      secureLocalStorage.setItem('FotoUnidade', FotoUnidade)
    }
  })

  const handleOpenClick = () => {
    setOpen(true);
  }

  const handleCloseClick = () => {
    setOpen(false);
  }

  const HandleClickFinal = async () => {
    const formData = new FormData();
  
    formData.append("Endereco", endereco);
    formData.append("nomeInstituicao", nome);
    formData.append("CPNJ", cpnj);
    formData.append("EspecialidadeDesejada", especialidade);
    formData.append("route", Router);
    formData.append("file", foto);
  
    try {
      await CreateRequestMutation.mutateAsync(formData);
      NavegationPage.push(`/unidade-especialista`);
    } catch (err) {
      setSnackbarMessage(
        'Ops Algo deu errado :(, parece que você não fez o primeiro cadastro, volte e faça o primeiro cadastro'
      );
      handleSnackBarOpen();
    }
  };
  

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    setFoto(selectedFile);
  };

  const HandleClickEnd = () => {
    if (endereco === '' || nome === '' || cpnj === '' || especialidade === '') {
      setSnackbarMessage("Ops, você não preencheu todos os campos. Preencha todos os campos obrigatórios.");
      handleSnackBarOpen();
    } else {
      HandleClickFinal()
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  return (
    <>
      <button onClick={handleOpenClick} className="w-72 h-12 rounded-full bg-indigo-950 text-white font-light">
        Finalizar Cadastro
      </button>

      <Dialog open={open}>
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
        <DialogContent>
          <div className="flex flex-col gap-5">
            <TextField
              variant="standard"
              label="Endereço da Empresa"
              InputProps={{
                sx: { borderBottom: "1px solid blue" }
              }}
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />

            <TextField
              variant="standard"
              label="Nome da Empresa/Instituiçao"
              InputProps={{
                sx: { borderBottom: "1px solid blue" }
              }}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <TextField
              variant="standard"
              label="CPNJ"
              InputProps={{
                sx: { borderBottom: "1px solid blue" }
              }}
              type="number"
              onChange={(e) => setCPNJ(e.target.value)}
              value={cpnj}
              required
            />

            <TextField
              variant="standard"
              label="Especialidade Desejada"
              InputProps={{
                sx: { borderBottom: "1px solid blue" }
              }}
              type="text"
              onChange={(e) => setEspecialidade(e.target.value)}
              value={especialidade}
              required
            />

            <button className={`border border-blue-500 p-2 rounded-full ${fotoError ? ' border border-red-600 bg-red-500 text-white' : ''}`} onClick={handleClick}>
              Foto
            </button>
            <input
              type="file"
              onChange={handleChange}
              ref={hiddenFileInput}
              style={{ display: 'none' }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={HandleClickEnd} className="w-72 h-12 rounded-full bg-indigo-950 text-white font-light">
          {CreateRequestMutation.isLoading ? <CircularProgress size={24}/> : 'Entrar'}
          </button>
        </DialogActions>

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
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormularioUnidade;
