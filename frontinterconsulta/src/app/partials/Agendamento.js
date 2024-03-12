import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { Checkout } from "../components/Checkout.jsx";
import { AgendamentoComponente } from "../components/AgendamentoComponent.jsx";
import { parse, isBefore, compareAsc } from "date-fns";

const AgendamentoConsulta = ({
  EspecialidadeMedica,
  titleButon,
  DoencaAutoComplete,
  SlugRoute,
  NomeMedico,
  Horarios,
  idMedico,
  ValorConsulta,
  FotoMedico,
  avaliacoes,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [snackbarOpen2, setSnackbarOpen2] = useState(false);
  const [snackbarMessage2, setSnackbarMessage2] = useState("");
  const [position, setPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const [doenca, setDoenca] = useState("");
  const [datas, setDatas] = useState([]);
  const [inicio, setInicio] = useState(null);
  const [fim, setFim] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [visibleData, setVisibleData] = useState(true);
  const [visibleHorarios, setVisibleHorarios] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedIntervals, setSelectedIntervals] = useState(null);
  const 
