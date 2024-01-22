import Image from 'next/image'
import Rating from '@mui/material/Rating'


export const AvaliacoesCarousel = ({ avaliacoes, readOnlyMode }) => {
  
    return (
      <>
        {avaliacoes.map((data, index) => (
          <div className="w-1/4 flex flex-col gap-5" key={index}>
            <h1>{data.AvaliacoesText}</h1>
            <div className="flex gap-5">
              <Image
                src={`http://localhost:8080/${data.Foto}`}
                height={50}
                width={50}
                alt="Logo Interconsulta"
                className="rounded-full"
              />
              <div className="flex justify-center items-center">
                <h1 className="font-bold text-blue-500">{data.NomePaciente}</h1>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Rating
                name="simple-controlled"
                value={data.AvaliacoesStar}
                readOnly={readOnlyMode}
              />
            </div>
          </div>
        ))}
      </>
    );
  };
  
