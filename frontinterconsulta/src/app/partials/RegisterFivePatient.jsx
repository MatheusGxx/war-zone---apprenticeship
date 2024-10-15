import { useEffect, useRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css'
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import SemFoto from '../public/SemFoto.jpg'
import AgendamentoConsulta from "./Agendamento"

export const RegisterFivePatient = ({
    hiddenFileInput,
    setFoto,
    Foto,
    HandleClickEnd,
    CreateRequestMutation,
    setCroppedImage,
    croppedImage,
    setCroppedFile,
    croppedFile,
    doenca,
}) =>{
  
    const cropperRef = useRef(null)

    const handleClick = () => {
      hiddenFileInput.current.click();
    };
  
    const handleChange = (event) => {
        const selectedFile = event.target.files[0];
        setFoto(selectedFile)
      };
    
    const handleCrop = () => {
    
      const croppedDataUrl = cropperRef.current.getCroppedCanvas()

           // Convertendo o canvas para um Blob (arquivo) usando o método toBlob
         croppedDataUrl.toBlob((blob) => {
            // Criando um arquivo a partir do Blob
        const croppedFile = new File([blob], 'croppedImage.png', { type: 'image/png' });
            setCroppedFile(croppedFile);
            setCroppedImage(croppedDataUrl.toDataURL())
          }, 'image/png');  
      }
    
      useEffect(() => {
    
        if (Foto) {
          const cropper = new Cropper(cropperRef.current, {
            aspectRatio: 1,
            viewMode: 2,
          });
    
          cropperRef.current = cropper;
    
          return () => {
            cropper.destroy()
          };
        }
      }, [Foto])
      
    return(
        <>
        <h1 className="text-blue-500 text-center"> Foto do Paciente:</h1>

        {Foto ? (
        <div className="flex justify-center items-center">
            <img
            ref={cropperRef}
            src={URL.createObjectURL(Foto)}
            alt="Foto Médico"
            className="rounded-lg"
            />
        </div>
        ) : (
        <>
            <div
            onClick={() => handleClick()}
            className="cursor-pointer flex justify-center items-center"
            >
            <Image src={SemFoto} width={300} height={300} alt="Sem Foto" />
            </div>
            <input
            type="file"
            onChange={(e) => handleChange(e)}
            ref={hiddenFileInput}
            style={{ display: 'none' }}
            name="file"
            />
        </>
        )}

        {Foto && (
        <div className="flex justify-center items-center mt-3">
            <button
            onClick={handleCrop}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
            <p> Cortar Imagem </p>
            </button>
        </div>
        )}

        {croppedImage && (
        <div className="flex justify-center items-center mt-3">
            <img src={croppedImage} alt="Cropped Image" className="rounded-lg" />
        </div>
        )}

        <div className="mr-3 flex justify-center items-center mt-5">
        <button
            onClick={HandleClickEnd}
            className="w-72 h-12 rounded-full bg-indigo-950 text-white font-light"
        >
            {CreateRequestMutation.isLoading ? (
            <CircularProgress size={24} />
            ) : (
             doenca ? `Resolver ${doenca}`  : `Finalizar Cadastro`
            )}
        </button>
        </div>

        </>
    )
}