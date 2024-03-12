import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { config } from "../config";

const FormularioUnidade = () => {
  const [open, setOpen] = useState(false);
  const [foto, setFoto] = useState(null);
  const [fotoError, setFotoError] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [nome, setNome] = useState("");
  const [cpnj, setCPNJ] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const Params = useSearchParams();
  const parametrer = Params.get("id");
  const Router = useRouter();
  const pathname = usePathname();

  const CreateRequestMutation = useMutation(
    async (valueRequest) => {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/obrigado/${parametrer}`,
        valueRequest
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        const { token, NomeUnidade, FotoUnidade } = data;
        secureLocalStorage.setItem("token", token);
        secureLocalStorage.setItem("id", parametrer);
        secureLocalStorage.setItem("NomeUnidade", NomeUnidade);
        secureLocalStorage.setItem("FotoUnidade", FotoUnidade);
      },
    }
  );

  const handleOpenClick = () => {
    setOpen(true);
  };

  const handleCloseClick = () => {
    setOpen(false);
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setFoto(selectedFile);
    setFotoError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (event.target.checkValidity() === false) {
      setSnackbarMessage("Por favor, preencha todos os campos.");
      handleSnackbarOpen();
      return;
    }

    if (!foto) {
      setFotoError(true);
      setSnackbarMessage("Por favor, selecione uma foto.");
      handleSnackbarOpen();
      return;
    }

    const formData = new FormData();
    formData.append("Endereco", endereco);
    formData.append("nomeInstituicao", nome);
    formData.append("CPNJ", cpnj);
    formData.append("EspecialidadeDesejada", especialidade);
    formData.append("route", pathname);
    formData.append("file", foto);

    try {
      await CreateRequestMutation.mutateAsync(formData);
      Router.push("/unidade-especialista");
    } catch (err) {
      setSnackbarMessage(
        "Ops, algo deu errado. Parece que você não fez o primeiro cadastro. Volte e faça o primeiro cadastro."
      );
      handleSnackbarOpen();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenClick}
        fullWidth
      >
        Finalizar Cadastro
      </Button>

      <Dialog open={open} onClose={handleCloseClick}>
        <DialogTitle>
          <Image
            src="/Logo2.png"
            alt="Logo 2 Interconsulta"
            height={200}
            width={220}
          />
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="endereco"
              label="Endereço da Empresa"
              type="text"
              fullWidth
              variant="standard"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="nome"
              label="Nome da Empresa/Instituição"
              type="text"
              fullWidth
              variant="standard"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="cpnj"
              label="CPNJ"
              type="number"
              fullWidth
              variant="standard"
              value={cpnj}
              onChange={(e) => setCPNJ(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="especialidade"
              label="Especialidade Desejada"
              type="text"
              fullWidth
              variant="standard"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              required
            />
            <input
              type="file"
              onChange={handleFileInputChange}
              ref={hiddenFileInput}
              style={{ display: "
