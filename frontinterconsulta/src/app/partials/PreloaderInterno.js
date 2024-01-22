'use client'
import React from 'react';
import Image from 'next/image';
import Logo from '../public/logo.png'

const Preloader = () => {
  return (
    <div className=' flex flex-1 justify-center items-center'>
      <Image
      src={Logo}
      alt='Logo'
      width={100}
      height={100}
      className='animate-pulse'
      />
    </div>
  );
};

export default Preloader;
