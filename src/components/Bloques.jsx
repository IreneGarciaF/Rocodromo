import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container } from 'react-bootstrap';
import { FaStar, FaInfoCircle } from 'react-icons/fa';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase-config'
import '../Styles/Bloques.css';

//imágenes
import bloque1 from '../assets/bloque1.jpg'

const Bloques = ({ image, name, blockId }) => {  // Ahora recibimos `blockId` como prop
    const [hasClimbed, setHasClimbed] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true); // Definir el estado loading
    const [user, setUser] = useState(null); // Maneja el estado de autenticación

    const handleClimbedChange = (e) => setHasClimbed(e.target.checked);
    const handleRatingChange = (newRating) => setRating(newRating);
    const handleCommentChange = (e) => setComment(e.target.value);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser({
                        uid: user.uid,
                        name: userData.name || "Usuario anónimo",
                    });
                } else {
                    setUser({
                        uid: user.uid,
                        name: "Usuario anónimo",
                    });
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.uid) {
            alert("Por favor, inicia sesión para poder dejar un comentario.");
            return;
        }

        const username = user.name || "Usuario anónimo";

        const newComment = {
            blockId,  
            userId: user.uid,
            name: username,
            rating,
            comment,
            hasClimbed,
            timestamp: serverTimestamp()
        };

        try {
            const db = getFirestore();
            const commentsRef = collection(db, 'comments');
            await addDoc(commentsRef, newComment);
            setComments([...comments, newComment]);
            setComment('');
            setHasClimbed(false);
            setRating(0);
        } catch (error) {
            console.error("Error al agregar comentario: ", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [blockId]);

    const fetchComments = async () => {
        try {
            const db = getFirestore();
            const commentsRef = collection(db, 'comments');
            const querySnapshot = await getDocs(commentsRef);
            const commentsData = querySnapshot.docs
                .map(doc => doc.data())
                .filter(comment => comment.blockId === blockId);  // Filtramos por `blockId`
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid>
            <Card className="bloque-container">
                <Card className="valoracion-container">
                    <Card.Img className="img-bloque" variant="top" src={image || bloque1} alt={`Rocódromo ${name}`} />
                    <Card.Body>
                        <Card.Title>{name}</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Check
                                type="checkbox"
                                label="¡Encadenado!"
                                checked={hasClimbed}
                                onChange={handleClimbedChange}
                            />
                            <Form.Label className="valoracion-estrellas">
                                Valoración
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id="tooltip-valoracion">
                                            Valora el bloque y ayuda a los Route-Setters a saber lo que más os gusta escalar, ¡si te gusta, pondrán más bloques parecidos!
                                        </Tooltip>
                                    }
                                >
                                    <span className="info-icon">
                                        <FaInfoCircle style={{ marginLeft: '5px', cursor: 'pointer', color: 'gray' }} />
                                    </span>
                                </OverlayTrigger>
                            </Form.Label>

                            <div className="estrellas">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        color={index < rating ? 'gold' : 'gray'}
                                        onClick={() => handleRatingChange(index + 1)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>

                            <Form.Group controlId="comment" className="comentario-bloque">
                                <Form.Label>Comentarios
                                    <p>(opcional)</p>
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={comment}
                                    onChange={handleCommentChange}
                                />
                            </Form.Group>
                            <Button className="comentario-btn" type="submit">Publicar comentario</Button>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="comentarios-card">
                    <Card.Body>
                        <h5>Comentarios</h5>
                        {loading ? (
                            <p>Cargando comentarios...</p>
                        ) : comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index}>
                                    <strong>{comment.name}</strong>
                                    {comment.hasClimbed && <h6><em>¡Lo ha encadenado!</em></h6>}
                                    <div>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                color={i < comment.rating ? 'gold' : 'gray'}
                                            />
                                        ))}
                                    </div>
                                    
                                  
                                    <p>{comment.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay comentarios aún.</p>
                        )}
                    </Card.Body>
                </Card>
            </Card>
        </Container>
    );
};

export default Bloques;
