import { useState, useEffect, useRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import SemFoto from '../public/SemFoto.jpg';

export const RegisterMédicoSeven = ({
  onImageChange,
  onImageCrop,
  imageFile,
  croppedImage,
  onSubmit,
}) => {
  const cropperRef = useRef(null);

  const handleClick = () => {
    onImageChange(document.getElementById('hiddenFileInput').files[0]);
  };

  useEffect(() => {
    if (imageFile) {
      const cropper = new Cropper(cropperRef.current, {
        aspectRatio: 1,
        viewMode: 2,
      });

      cropperRef.current = cropper;

      return () => {
        cropper.destroy();
      };
    }
  }, [imageFile]);

  useEffect(() => {
    if (imageFile) {
      const imageElement = cropperRef.current.image;
      const cropper = cropperRef.current;

      imageElement.src = URL.createObjectURL(imageFile);
      cropper.getCroppedCanvas().toBlob((blob) => {
        onImageCrop(blob);
      }, 'image/png');
    }
  }, [imageFile, onImageCrop]);

  return (
    <>
      <h1 className="text-blue-500 text-center"> Foto do Médico:</h1>

      <div className="flex justify-center items-center">
        {croppedImage ? (
          <img
            src={URL.createObjectURL(croppedImage)}
            alt="Cropped Image"
            className="rounded-lg"
          />
        ) : (
          <>
            <div
              onClick={() => handleClick()}
              className="cursor-pointer flex justify-center items-center"
            >
              <Image src={SemFoto} width={300} height={300} alt="Sem Foto" />
            </div>
            <input
              id="hiddenFileInput"
              type="file"
              onChange={(e) => handleClick()}
              ref={useRef(null)}
              style={{ display: 'none' }}
              name="file"
            />
          </>
        )}
      </div>

      <div className="flex justify-center items-center mt-3">
        <button
          onClick={onSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {onSubmit.isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              Entrar <AddPhotoAlternateIcon className="ml-2" />
            </>
          )}
        </button>
      </div>
    </>
  );
};
