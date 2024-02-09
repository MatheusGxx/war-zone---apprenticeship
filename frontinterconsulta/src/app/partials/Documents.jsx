import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useState, useEffect } from 'react'; 
import { Dialog, DialogContent } from '@mui/material'
import { SolicitaçaoExames } from '../components/SolicitaçaoExames'
import { AtestadoDoctor } from '../components/Atestado'
import { ReceitaSimples } from '../components/ReceitaSimples'
import Image from 'next/image';
import Logo from '../public/logo.png';
import Logo2 from '../public/Logo2.png';

export const Documents = ({ onClose, Medicaçao, diasAfastamento, SolicitarExames }) => {
    const [open, setOpen] = useState(false);
    const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
    const documents = []

    useEffect(() => {
        setOpen(true)
    }, []);

    const handleClose = () => {
        setOpen(false)
        onClose()
    };

    if (Medicaçao) {
        documents.push(<ReceitaSimples/>)
    }

    if (diasAfastamento) {  
        documents.push(<AtestadoDoctor/>);
    }

    if (SolicitarExames) {
        documents.push(<SolicitaçaoExames/>)
    }

    const handleNextDocument = () => {
        setSelectedDocumentIndex((prevIndex) => (prevIndex + 1) % documents.length);
    };

    const handlePreviousDocument = () => {
        setSelectedDocumentIndex((prevIndex) => (prevIndex - 1 + documents.length) % documents.length)
    };

    return (
        <Dialog 
            open={open} 
            PaperProps={{
                style: {
                    maxWidth: '1250px', 
                    width: '100%',
                    height: '80%',
                    maxHeight: '900px'
                },
            }}
            onClose={handleClose}
        >
            <div className='flex flex-col justify-center items-center'>
                <div className='pt-6'>
                    <Image
                        src={Logo2}
                        alt='Segundo Logo Interconsulta'
                        width={200}
                        height={100}
                    />
                </div>
            </div>

            <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className='container flex justify-between items-center'>
                    <ArrowBackIosNewRoundedIcon 
                        color="primary" 
                        className='cursor-pointer' 
                        onClick={handlePreviousDocument}
                    />
                    {documents.length > 0 ? documents[selectedDocumentIndex] : 'Nenhum documento preenchido'}
                    <ArrowForwardIosIcon 
                        color="primary" 
                        className="cursor-pointer" 
                        onClick={handleNextDocument}
                    />
                </div>
            </DialogContent>

            <div className="flex justify-end p-4">
                <Image
                    src={Logo}
                    alt="Logo Interconsulta"
                    height={40}
                    width={40}
                    className='animate-spin-slow'
                />
            </div>
        </Dialog>
    );
};
