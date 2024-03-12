import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { config } from '../config'

const useAccordion = (queryKey, queryFn, mutationFn) => {
  const queryClient = useQueryClient()
  const [data, setData] = useState([])
  const [newData, setNewData] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { data: queryData, isLoading, isError, refetch, isSuccess } = useQuery(
    queryKey,
    queryFn,
    {
      onError: (error) => {
        setErrorMessage(error.message)
      },
    }
  )

  const { mutate: mutateFnAsync } = mutationFn(
    (valueBody) => mutationFn.mutateAsync(valueBody),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey)
        setNewData('')
        setIsOpen(false)
      },
      onError: (error) => {
        setErrorMessage(error.message)
      },
    }
  )

  useEffect(() => {
    if (isSuccess) {
      setData(queryData)
    }
  }, [queryData, isSuccess])

  const handleAddData = () => {
    if (newData.trim() !== '') {
      mutateFnAsync({ id: IdentificadorConsulta, data: newData })
    }
  }

  const handleDeleteData = (id) => {
    mutateFnAsync(id)
  }

  return {
    data,
    newData,
    isOpen,
    isLoading,
    isError,
    errorMessage,
    setNewData,
    setIsOpen,
    refetch,
    handleAddData,
    handleDeleteData,
  }
}

const AccordionReuniaoMédico = ({
  setReceitaSimples,
  receitaSimples,
  setReceitaControlada,
  receitaControlada,
  setDiasAfastamento,
  diasAfastamento,
  setCID,
  cid,
  setSolicitarExames,
  SolicitarExames,
  IdentificadorConsulta,
  setSnackbarMessage,
  handleSnackBarOpen,
  NomeMedico,
  NomePaciente,
}) => {
  const {
    data: receitas,
    newData: newReceitaSimples,
    isOpen: isOpenReceitaSimples,
    isLoading: isLoadingReceitaSimples,
    isError: isErrorReceitaSimples,
    errorMessage: errorMessageReceitaSimples,
    setNewData: setNewReceitaSimples,
    setIsOpen: setIsOpenReceitaSimples,
    refetch: refetchReceitas,
    handleAddData: handleAddReceitaSimples,
    handleDeleteData: handleDeleteReceitaSimples,
  } = useAccordion(
    ['ReceitaSimples', IdentificadorConsulta],
    () => getReceitaSimples(IdentificadorConsulta),
    (mutationFn) => useMutation(mutationFn, {
      onSettled: () => {
        queryClient.invalidateQueries('ReceitaSimples');
      },
    }
  ))

  const {
    data: receitasControladas,
    newData: newReceitaControlada,
    isOpen: isOpenReceitaControlada,
    isLoading: isLoadingReceitaControlada,
    isError: isErrorReceitaControlada,
    errorMessage: errorMessageReceitaControlada,
    setNewData: setNewReceitaControlada,
    setIsOpen: setIsOpenReceitaControlada,
    refetch: refetchReceitasControladas,
    handleAddData: handleAddReceitaControlada,
    handleDeleteData: handleDeleteReceitaControlada,
  } = useAccordion(
    ['ReceitaControlada', IdentificadorConsulta],
    () => getReceitaControlada(IdentificadorConsulta),
    (mutationFn) => useMutation(mutationFn, {
      onSettled: () => {
        queryClient.invalidateQueries('ReceitaControlada');
      },
    }
  ))

  const {
    data: atestados,
    newData: newAtestado,
    isOpen: isOpenAtestado,
    isLoading: isLoadingAtestado,
    isError: isErrorAtestado,
    errorMessage: errorMessageAtestado,
    setNewData: setNewAtestado,
    setIsOpen: setIsOpenAtestado,
    refetch: refetchAtestados,
    handleAddData: handleAddAtest
