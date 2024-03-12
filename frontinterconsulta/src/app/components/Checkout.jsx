import { useState, useEffect } from 'react';
import {
  'use client',
  TextField,
  Autocomplete,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Button,
  Cards,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from '../components';
import { FormasDePagamento, DocumentsSelectPaciente } from '../partials';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import copyToClipboard from 'clipboard-copy';
import { config } from '../config';
import Logo from '../public/logo.png';

export const Checkout = ({
  FotoMedico,
  avaliacoes,
  readOnlyMode,
  Doenca,
  NamePaciente,
  NomeMedico,
  ValorConsulta,
  setPagamento,
  formasPagamento,
  idMedico,
  setDocumentos,
  documentos,
}) => {
  const [pix, setPix] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [pixCopia, setPixCopia] = useState('');
  const [linkPagamentoPix, setLinkPagamentoPix] = useState('');
  const [cartaoDeCredito, setCartaoDeCredito] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal } = position;
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });
  const stripe = useStripe();
  const elements = useElements();

  const id = secureLocalStorage.getItem('id');

  const copyToClipboardHandler = () => {
    if (copyToClipboard(pixCopia)) {
      setSnackbarMessage('Pix Copia e cola Copiado com Sucesso!');
      handleSnackBarOpen();
    }
  };

  const PaymentDoctor = useMutation(
    async (valueRequest) => {
      const request = await axios.post(`${config.apiBaseUrl}/api/payment`, valueRequest);
      return request.data;
    },
    {
      onSuccess: (data) => {
        const { PixCopiaECola, PixQrCode, LinkPagamentoPix, TypePayment } = data;

        if (TypePayment === 'Pix') {
          setQrCode(PixQrCode);
          setPixCopia(PixCopiaECola);
          setLinkPagamentoPix(LinkPagamentoPix);
        }
      },
    }
  );

  const HandleSelectPayment = async (newValue) => {
    if (newValue === 'Pix') {
      setPix(true);
      await PaymentDoctor.mutateAsync({
        id: id,
        ValorConsulta: ValorConsulta,
        TypePayment: 'Pix',
      });
    }
    if (newValue === 'Cartão de Crédito') {
      setCartaoDeCredito(true);
    }
  };

  const handleInputChange = (evt) => {
    const { value, name } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  const ValueCheckBoxDocumentos = (event, value) => {
    if (event.target.checked) {
      setDocumentos((prev) => [...prev, value]);
    } else {
      setDocumentos((prev) => prev.filter((Ferramenta) => Ferramenta !== value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      id: id,
      ValorConsulta: ValorConsulta,
      TypePayment: 'CartaoCredito',
      cardNumber: state.number,
      cardExpiry: state.expiry,
      cardCvc: state.cvc,
      cardName: state.name,
    };

    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/payment`, payload);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="font-bold text-blue-500 text-center text-lg">
        {NamePaciente} Escolha qual documento voce precisa!
      </h1>

      <div className="flex gap-3 justify-center items-center mt-10 mb-5">
        {DocumentsSelectPaciente.map((item, index) => (
          <div className="flex" key={index}>
            <FormControlLabel
              control={<Checkbox {...item} onChange={(event) => ValueCheckBoxDocumentos(event, item)} />}
              label={item}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 mb-5 flex flex-col gap-3">
        {documentos.length > 1 ? (
          documentos.map((data, index) => (
            <div key={index} className="flex gap-3">
              <DocumentScannerIcon color="primary" />
