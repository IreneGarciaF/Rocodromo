import React from 'react';
import { Container } from 'react-bootstrap';
import Bloques from './Bloques';  // Importa tu componente de bloques

import foto1 from '../assets/bloque1.jpg'
import foto2 from '../assets/bloque2.jpg'
import foto3 from '../assets/bloque3.jpg'
import foto4 from '../assets/bloque4.jpg'

// Definir bloques con diferentes imágenes
const bloques = [
    {
        blockId: 'bloque1',
        name: 'Bloque 1',
        image: foto1, // Se pasa la variable directamente sin las llaves
    },
    {
        blockId: 'bloque2',
        name: 'Bloque 2',
        image: foto2, // Lo mismo aquí
    },
    {
        blockId: 'bloque3',
        name: 'Bloque 3',
        image: foto3, // Y aquí
    }, 
    {
        blockId: 'bloque4', // Aquí también debes cambiar el `blockId` a 'bloque4'
        name: 'Bloque 4', // Cambia el nombre para que sea único
        image: foto4, // Y la imagen correspondiente
    }
];

const BloquesList = () => {
    return (
        <Container fluid>
            {/* Mapeamos sobre los bloques definidos en el arreglo */}
            {bloques.map((bloque) => (
                <Bloques 
                    key={bloque.blockId}
                    name={bloque.name}
                    image={bloque.image}
                    blockId={bloque.blockId}
                />
            ))}
        </Container>
    );
};

export default BloquesList;
