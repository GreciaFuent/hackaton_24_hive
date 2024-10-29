import React, { useEffect, useState } from "react";
import "../styles/Notas.css";
import Nota from "../components/Nota";
import Header from "../components/Header";

function Notas() {

    const [information, setDescription] = useState('');
    const [fechaCompleta, setfechaCompleta] = useState('');
    const [notas, setNotas] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    // Hay que obtener al usuario
    // const user = usuario
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    // mostrar notas
    const fetchNotas = async () => {
        const idUser = localStorage.getItem("user");

        const response = await fetch('http://localhost:3001/api/getNotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUser })
        });
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                setNotas(data);
                console.log("Los datos se han cargado correctamente");
            } else {
                console.error("Los datos recibidos no son un arreglo:", data);
            }
        }
    };
    
    useEffect(() => {
        fetchNotas();
    }, []);

    // Eliminar Nota
    const handleDelete = async (idNote) => {
        const response = await fetch('http://localhost:3001/api/deleteNotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idNote })
        });
        if (response.ok) {
            await response.json();
            alert("Se elimino correctamente")
            // Filtrar la nota eliminada del estado
            setNotas(prevNotas => prevNotas.filter(nota => nota.idNote !== idNote));
        } else {
            console.log("No se eliminó");
        }
    };
    
    // Ingresar nota
    const handleSave = async () => {
        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const anio = fechaActual.getFullYear();
        const confirmatedDate = `${dia}/${fechaActual.getMonth() + 1}/${anio}`;
        setfechaCompleta(confirmatedDate);

        const idUser =  localStorage.getItem("user");
        const nuevaNota = { idUser, information, confirmatedDate };

        const response = await fetch('http://localhost:3001/api/insertNote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaNota),
        });
        if (response.ok) {
            alert('Se ha registrado la nota');
            setNotas(prevNotas => [...prevNotas, nuevaNota]);
        } else {
            alert('Error al registrar la nota');
        }

        setDescription("");
        setIsOpen(false);
    };

    return (
        <div className="notas-container">
             <Header />
            <div className="button-container">
                <button className="open-modal-btn" onClick={toggleModal}>Agregar nota</button>
            </div>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="tittle-flotante">Ingresar una nota</p> 
                        <input
                            type="text"
                            id="Descripción de la nota"
                            value={information}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ingresa la nota a guardar"
                        />
                        <button className="close-modal-btn" onClick={handleSave}>Guardar</button>
                    </div>
                </div>
            )}
            
            {notas.length > 0 && (
                <div className="notas">
                    {notas.map((nota, index) => (
                        <Nota
                            key={index}
                            description={nota.information || "Sin descripción"}
                            fecha={nota.confirmatedDate} 
                            onDelete={() => handleDelete(nota.idNote)} // Pasa la función de eliminación
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notas;
