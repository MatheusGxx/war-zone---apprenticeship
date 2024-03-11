import { useState, useEffect } from 'react';
import Logo from '../public/logo.png';
import Logo2 from '../public/Logo2.png';
import Image from 'next/image';
import { TextField, CircularProgress, Snackbar, Alert, Stack, SnackbarContent } from '@mui/material';
import IconBack from '../partials/IconBack.js';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'

const CadastroPacienteLead = ({ title, subtitle, ImagemLateral, apelido, mensagem }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [sintomasandDoencas, setSintomasAndDoencas] = useState([]);
  const [doenca, setDoenca] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  const getSintomasAndDoencas = useMutation(async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/get-sintomas-doencas`);
    setSintomasAndDoencas(response.data.arr);
    return response.data;
  });

  useEffect(() => {
    getSintomasAndDoencas.mutate();
  }, []);

  const CreateRequestMutation = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/register`, valueRequest);
      console.log(response.data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        const { id, token, NomePaciente, Doenca } = data;
        secureLocalStorage.setItem('token', token);
        secureLocalStorage.setItem('id', id);
        secureLocalStorage.setItem('NomePaciente', NomePaciente);
        secureLocalStorage.setItem('Doenca', Doenca);

        router.push(`/especialistas-disponiveis`);
      },
    }
  );

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (name === '' || email === '' || number === '') {
      setSnackbarMessage(`Por favor ${apelido} preencha todos os dados de Cadastro`);
      handleSnackBarOpen();
      return;
    }

    try {
      await CreateRequestMutation.mutateAsync({
        nome: name,
        email: email,
        telefone: number,
        doenca: doenca?.value || '',
        route: pathname,
      });
      secureLocalStorage.setItem('InitialContact', 'true');
    } catch (error) {
      setSnackbarMessage(`${apelido}, Email ou Telefone já estão em uso, por favor escolha outro telefone ou email`);
      handleSnackBarOpen();
    }
  };

  return (
    <>
      <div className='flex'>
        <div className='w-1/2 sm:w-full md:w-full lg:w-full'>
          <section className="flex flex-col gap-10 justify-center items-center sm:gap-5 lg:gap-6 mt-16">
            <div className="justify-center items-center">
              <Image src={Logo2} alt="Logo Interconsulta" height={250} width={250} />
            </div>

            <Image
              src={ImagemLateral}
              alt="Imagem Login"
              className='hidden sm:block md:block lg:block rounded-full'
              height={60}
              width={60}
            />

            <h1 className="text-blue-600 text-3xl sm:text-center sm:text-2xl"> {title} </h1>
            <h1 className='text-blue-600 text-2xl sm:text-center sm:text-xl'> {subtitle}</h1>

            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Nome Completo"
                variant="standard"
                sx={{ width: '300px' }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextField
                label="Seu e-mail de uso"
                variant="standard"
                sx={{ width: '300px' }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                label="Whatsapp para contato ex: 11893724023"
                variant="standard"
                sx={{ width: '300px' }}
                type="tel"
                value={number}
                inputMode="tel"
                pattern="^\d{11,15}$"
                onChange={(e) => setNumber(e.target.value)}
                required
              />

              <Autocomplete
                value={doenca}
                onChange={(event, newValue) => {
                  setDoenca(newValue);
                }}
                options={sintomasandDoenc
