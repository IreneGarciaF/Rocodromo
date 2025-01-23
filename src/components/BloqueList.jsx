import React from 'react';
import { Container } from 'react-bootstrap';
import Bloques from './Bloques'; 

import foto1 from '../assets/bloque1.jpg'
import foto2 from '../assets/bloque2.jpg'
import foto3 from '../assets/bloque3.jpg'
import foto4 from '../assets/bloque4.jpg'


const bloques = [
    {
        blockId: 'bloque1',
        name: 'Bloque 1',
        image: foto1,
    },
    {
        blockId: 'bloque2',
        name: 'Bloque 2',
        image: foto2,
    },
    {
        blockId: 'bloque3',
        name: 'Bloque 3',
        image: foto3,
    }, 
    {
        blockId: 'bloque4', 
        name: 'Bloque 4', 
        image: foto4, 
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
