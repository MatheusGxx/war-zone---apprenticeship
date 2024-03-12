import Image from 'next/image'
import Rating from '@mui/material/Rating'
import { config } from '../config';

export const AvaliacoesCarousel = ({ avaliacoes, readOnlyMode }: { avaliacoes: Array<{ AvaliacoesText: string, Foto: string, NomePaciente: string, AvaliacoesStar?: number }>, readOnlyMode: boolean }) => {
  return (
    <div className="flex flex-wrap gap-5">
      {avaliacoes.map((data, index) => (
        <div className="w-1/4 flex flex-col gap-5" key={index}>
          <h1>{data.AvaliacoesText}</h1>
          <div className="flex gap-5 items-center">
            <Image
              src={data.Foto ? `${config.apiBaseUrl}/${data.Foto}` : '/place holder image url'}
              height={50}
              width={50}
              alt="Logo Interconsulta"
              className="rounded-full"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/place holder image url'; }}
            />
            <div className="flex justify-center items-center">
              <h1 className="font-bold text-blue-500">{data.NomePaciente}</h1>
            </div>
          </div>
          {data.AvaliacoesStar && <div className="flex justify-center items-center">
            <Rating
              name="simple-controlled"
              value={data.AvaliacoesStar}
              readOnly={readOnlyMode}
            />

