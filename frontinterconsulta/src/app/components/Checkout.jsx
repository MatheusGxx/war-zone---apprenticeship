'use client'
import Image from 'next/image'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Rating from '@mui/material/Rating'
import { TextField, Autocomplete, Snackbar, Alert } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { FormasDePagamento } from '../partials/FormasPagamentos'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Cards from 'react-credit-cards-2';
import axios from 'axios'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import secureLocalStorage from 'react-secure-storage'
import copyToClipboard from 'clipboard-copy'
import { config } from '../config.js'

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
     }) => {

    
   const [pix, setPix] = useState(false)

   const [qrCode, setQrCode] = useState(null)
   const [pixCopia, setPixCopia] = useState(null)
   const [linkPagamentoPix, setLinkPagamentoPix] = useState(null)

   const [cartaoDeCredito, setCartaoDeCredito] = useState(false)
   const [snackbarOpen, setSnackbarOpen] = useState(false)
   const [snackbarMessage, setSnackbarMessage] = useState("")

   const [position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'right'
  })

  const { vertical, horizontal } = position

   const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  })


  useEffect(() => {

  },[pix,pixCopia, cartaoDeCredito])

  useEffect(() => {

  },[formasPagamento])

  
  const id = secureLocalStorage.getItem('id')

  const copyToClipboardHandler = () => {
    if (pixCopia) {
      copyToClipboard(pixCopia);
      setSnackbarMessage('Pix Copia e cola Copiado com Sucesso!')
      handleSnackBarOpen()
    }
  };

  const PaymentDoctor = useMutation(
    async (valueRequest) => {
      const request = await axios.post(`http://${config.apiBaseUrl}:8080/api/payment`, valueRequest);
      return request.data;
    },
    {
      onSuccess: (data) => {
        const { PixCopiaECola, PixQrCode, LinkPagamentoPix,  TypePayment } = data

        if(TypePayment === 'Pix'){
          setQrCode(PixQrCode)
          setPixCopia(PixCopiaECola)
          setLinkPagamentoPix(LinkPagamentoPix)
        }
      },
    }
  );

   const HandleSelectPayment = async (newValue) => {
      if(newValue === 'Pix'){
        setPix(true)
         await PaymentDoctor.mutateAsync(
          { id: id, ValorConsulta: ValorConsulta, TypePayment: 'Pix' }
          )
      }
      if(newValue === 'Cartão de Crédito'){
       setCartaoDeCredito(true)
      }
  }

  const handleInputChange = (evt) => {
    const { value, name } = evt.target;
  
    setState((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); 
  };

  const handleSnackBarOpen = () =>{
    setSnackbarOpen(true)
  }

    return(
        <>
          <div className="flex justify-center items-center flex-col gap-4">
           <Image src={`http://${config.apiBaseUrl}/${FotoMedico}`}
              alt="Foto do Médico" 
              width={200}
              height={200}
              className="rounded-xl"
             />
             <Rating 
             value={avaliacoes}
             readOnly={readOnlyMode} 
             name="simple-controlled"
             />

            <div className="flex flex-col gap-5">
            
            <div className="flex gap-5">
              
            <ArrowForwardIcon color="primary"/>
            <h1> Recupere-se sem limitações: elimine {Doenca}! 
              
            </h1>
            </div>

            <div className="flex gap-5">
            <ArrowForwardIcon color="primary"/>
              Diga adeus à {Doenca}, viva plenamente!
            </div>

            <div className="flex gap-5">
            <ArrowForwardIcon color="primary"/>
              Liberte-se das restrições: vença a {Doenca}
            </div>

            </div>

            <h1 className="text-center text-blue-500 font-bold"> 
              {NamePaciente} nao perca mais tempo com {Doenca}, eliminea agora com  {NomeMedico}
             </h1>

           </div>

            <TextField
              variant="standard"
              label="Valor da Consulta"
              InputProps={{
                sx: { borderBottom: "1px solid blue" },
                readOnly: true  
              }}
              type="text"
              required
              value={ValorConsulta}
              className="w-full"
            />

            <Autocomplete
            value={formasPagamento === '' ? null : formasPagamento}
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setPagamento(newValue)
                HandleSelectPayment(newValue)
              }
            }}
            options={FormasDePagamento}
            noOptionsText="Sem resultados"
            renderInput={(params) => <TextField {...params} label="Formas de Pagamento"
            variant="standard" />}
            className="w-full border-b border-blue-500 sm:w-full"
          />
         
         {pix ?
          qrCode && 
          <>
          <div className='flex flex-col justify-center items-center w-full pt-5 gap-5'>
            <h1 className='text-center  text-blue-500 text-2xl'> Pix QR Code:</h1>
          <img className='w-1/3 h-1/3' src={`data:image/jpeg;base64,${qrCode}`}/>


          <div className='flex justify-center flex-col  items-center w-full gap-3'>
          <h1 className='text-center text-blue-500 text-2xl'> Pix Copia e Cola </h1>
          <button className='p-2 rounded-full border-blue-500 border-2 w-1/2 animate-pulse'>
            <div className='flex justify-center items-center gap-5'>
              <h1>  Copiar Pix Copia e Cola</h1>
              <FileCopyIcon color="primary" className='cursor-pointer' onClick={copyToClipboardHandler}/>
            </div>  
          </button>
          </div>

          </div>
          </>
          : 
          cartaoDeCredito ?
          <>
          <div 
          className='flex gap-5 justify-center items-center 
          mt-5 p-5 w-full border-blue-500 border-4 rounded-lg'>

          <div className='flex flex-col gap-5 w-full justify-center items-center'>
          <TextField
            variant="standard"
            label="Numero do seu Cartão"
            name='number'
            InputProps={{
              sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
            }}
            type="text"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            value={state.number}
          />

          <TextField
            variant="standard"
            label="Nome do Cartão"
            name='name'
            InputProps={{
              sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
            }}
            type="text"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            value={state.name}
          />

        <TextField
            variant="standard"
            label="Data de Expiraçao do Cartão"
            name='expiry'
            InputProps={{
              sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
            }}
            type="text"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            value={state.expiry}
          />

        <TextField
            variant="standard"
            label="CVC do Cartão"
            name='cvc'
            InputProps={{
              sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
            }}
            type="text"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            value={state.cvc}
          />
          </div>

            <Cards
            number={state.number}
            expiry={state.expiry}
            cvc={state.cvc}
            name={state.name}
            focused={state.focus}
          />

          </div>
          </>
          : 
          null
        }

        <Snackbar
            open={snackbarOpen} 
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical, horizontal }}
          >
            <Alert onClose={handleSnackbarClose} severity="success">
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
    )
}