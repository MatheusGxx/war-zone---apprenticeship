'use client'
import React, { useState, useEffect } from "react"
import PopUpRecuperaçao from "../partials/PopUpRecuperaçao";

const Header = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [paginaCarregada, setPaginaCarregada] = useState(false);

  useEffect(() => {
    const carregarPagina = setTimeout(() => {
      setPaginaCarregada(true);
    }, 10000) 

    return () => clearTimeout(carregarPagina);
  }, []);

  const handleMouseEnter = () => {
    if (paginaCarregada) {
      setMostrarFormulario(true);
    }
  }

  return (
    <>
      <header
        className="container bg-blue-900 p-1 text-white"
        onMouseEnter={handleMouseEnter}
      >
        <h2 className="text-center text-lg">
          Conecte-se a especialistas do mundo Inteiro!
        </h2>
      </header>
      {mostrarFormulario && <PopUpRecuperaçao />}
    </>
  );
};

export default Header;
