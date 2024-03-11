import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import Logo2 from "../public/Logo2.png";
import Logo from "../public/logo.png";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { RegisterOnePatient } from "./RegisterOnePatient";
import { RegisterSecondPatient } from "./RegisterSecondPatient";
import { RegisterTreePatient } from "./RegisterTreePatient";
import { RegisterFourPatient } from "./RegisterFourPatient";
import { RegisterFivePatient } from "./RegisterFivePatient";
import { useEndRegister } from "../context/context";
import { config } from "../config";

export const EndRegisterPatient = () => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [foto, setFoto] = useState(null);

  const [genero, setGenero] = useState("");
  const [data, setData] = useState("");
  const [cpf, setCPF] = useState("");
  const [blood, setBlood] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [profissao, setProfissao] = useState("");
  const [CEP, setCEP] = useState("");
  const [cartaoSUS, setCartaoSUS] = useState("");
  const [nomeAcompanhante, setNomeAcompanhante] = useState("");
  const [telefoneAcompanhante, setTelefoneAcompanhante] = useState("");
  const [emailAcompanhante, setEmailAcompanhante] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estadoPaciente, setEstadoPaciente] = useState("");
  const [pais, setPais] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const { setRegisterEndOk } = useEndRegister();

  const doenca = secureLocalStorage.getItem("Doenca");
  const id = secureLocalStorage.getItem("id");
  const NomePaciente = secureLocalStorage.getItem("NomePaciente");
  const Router = usePathname();

  const CreateRequestMutation = useMutation(
    async (valueRequest) => {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/obrigado/${id}`,
        valueRequest
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        const { FotoPaciente } = data;
        secureLocalStorage.removeItem("FotoPaciente");
        secureLocalStorage.setItem("FotoPaciente", FotoPaciente);
        setOpen(false);
        secureLocalStorage.setItem("CadastroEndSucess", true);
        secureLocalStorage.setItem("RegisterSucessPatient", "cadastroFinalizado");
        setRegisterEndOk(true);
      },
    }
  );

  const HandleClickFinal = async () => {
    const formData = new FormData();
    formData.append("Genero", genero);
    formData.append("Data", data);
    formData.append("TipoSanguineo", blood);
    formData.append("Profissao", profissao);
    formData.append("EstadoCivil", estadoCivil);
    formData.append("CPF", cpf);
    formData.append("CEP", CEP);
    formData.append("CartaoSUS", cartaoSUS);
    formData.append("NomeAcompanhante", nomeAcompanhante);
    formData.append("TelefoneAcompanhante", telefoneAcompanhante);
    formData.append("EmailAcompanhante", emailAcompanhante);
    formData.append("EnderecoPaciente", endereco);
    formData.append("CidadePaciente", cidade);
    formData.append("EstadoPaciente", estadoPaciente);
    formData.append("Pais", pais);
    formData.append("file", foto);

    try {
      await CreateRequestMutation.mutateAsync(formData);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setSnackbarMessage(
        'Ops Algo deu errado :('
      );
      handleSnackBarOpen();
    }
  };

  const HandleClickEnd = () => {
    if (
      genero === "" ||
      data === "" ||
      cpf === "" ||
      CEP === "" ||
      endereco === "" ||
      cidade === "" ||
      estadoPaciente === "" ||
      pais === ""
    ) {
      setSnackbarMessage("Ops Paciente, Tem campo faltando para voce preencher.");
      handleSnackBarOpen();
    } else {
      HandleClickFinal();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Dialog
        open={open}
       
