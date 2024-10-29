import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Tarjeta from "../components/Tarjeta";
import "../styles/SingleGroup.css";

function SingleGroup() {
    const [showId, setShowId] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        day: "",
        month: "",
        year: "",
    });
    const [error, setError] = useState("");
    const [events, setEvents] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [idName, setGroupId] = useState('');
    const [members, setMembers] = useState([]); 
    const [showModalMiembros, setShowModalMiembros] = useState(false);

    const toggleIdVisibility = () => {
        setShowId(!showId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Función para obtener todos los eventos del usuario, con user y con grupos

    const getEvents = async () => {
        const idGroup = localStorage.getItem('group');

        const response = await fetch('http://localhost:3001/api/getEvent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idGroup }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data); // Verifica aquí los datos
          setEvents(data);
        } else {
          console.error("Error al obtener los eventos");
        }
    };



    // Función para obtener a los miembros de un grupo

    const getMembers = async () => {
        const idGroup = localStorage.getItem('group');
        const response = await fetch('http://localhost:3001/api/getMembers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idGroup }),
        });

        if (response.ok) {
            const data = await response.json();
            
            console.log(data);
            setGroupName(data[0].name);
            setGroupId(data[0].idGroup)
            const memberNames = data.map(memberObj => memberObj.member);
            setMembers(memberNames);
        }
    };

    useEffect(() => {
        getEvents();
        console.log("Soy los members")
        getMembers();
        console.log(localStorage.getItem('group'))
    }, []);

    const validateDate = () => {
        const day = parseInt(formData.day, 10);
        const month = parseInt(formData.month, 10);
        const year = parseInt(formData.year, 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            setError("Todos los campos de fecha deben ser números.");
            return false;
        }
        if (day < 1 || day > 31) {
            setError("El día debe estar entre 1 y 31.");
            return false;
        }
        if (month < 1 || month > 12) {
            setError("El mes debe estar entre 1 y 12.");
            return false;
        }
        if (year < 1900 || year < new Date().getFullYear()) {
            setError("El año debe ser válido.");
            return false;
        }
        setError("");
        return true;
    };

    // Funcion para mandar los datos a la base de datos
    const handleCreateEvent = () => {
        if (validateDate()) {
            const idUser = localStorage.getItem('user');
            const idGroup = localStorage.getItem('group');

            console.log(idUser, idGroup);
            

            const eventData = {
                idUser: idUser,
                idGroup: idGroup,
                title: formData.title,
                description: formData.description,
                createdDate: new Date().toISOString(),
                expiredDate: new Date(formData.year, formData.month - 1, formData.day).toISOString()
            };

            console.log(eventData)

    
            // Aquí puedes realizar una solicitud al backend
            fetch('http://localhost:3001/api/registerEvent', {
                method: 'POST', // Método de la solicitud
                headers: {
                    'Content-Type': 'application/json', // Tipo de contenido
                },
                body: JSON.stringify(eventData), 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la creación del evento');
                }
            })
            .then(data => {
                alert('Evento creado exitosamente:')
                setShowModal(false); 
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud:', error); 
            });
        } else {
            console.log("La fecha no es válida.");
        }
    };

    const toggleModal = () => setShowModalMiembros(!showModalMiembros);


    return (
        <div className="sigle_group">
            <Header />
            <div className="info_grupo">
                <h1 className="titulo">{groupName}</h1>
                <ul className="info">
                    <li>
                        <button className="id_grupo" onClick={toggleIdVisibility}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M14 14.252V22H4a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm6 4v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
                                </g>
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button onClick={toggleModal} className="abrir-modal">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 100-6 3 3 0 000 6zm-5.784 6A2.238 2.238 0 015 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 005 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button className="crear_evento" onClick={() => setShowModal(true)}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2v2zM4 9v10h16V9H4zm2 4h5v4H6v-4z"></path>
                                </g>
                            </svg>
                        </button>
                    </li>
                    {showId && <li className="id">{idName}</li>}
                </ul>
            </div>

             <div className="eventos">
                {events.map((event, index) => (
                    <Tarjeta
                        key={event.id || index}
                        title={event.title}
                        description={event.information}
                        group={event.groupName}
                        date={event.expiredDate}
                        usuario={event.idUser}
                    />
                ))}
            </div>

            {/* Modal de Crear Evento */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Crear Nuevo Evento</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="Título del evento"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Descripción"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="day"
                            placeholder="Día"
                            value={formData.day}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="month"
                            placeholder="Mes"
                            value={formData.month}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="year"
                            placeholder="Año"
                            value={formData.year}
                            onChange={handleInputChange}
                        />

                        {error && <p className="error">{error}</p>}

                        <button onClick={handleCreateEvent}>Crear Evento</button>
                        <button onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* modal miembros */}
            {showModalMiembros && (
                    <div className="modal">
                        <div className="modal-contenido">
                            <h1 className="titulo">Miembros del grupo</h1>
                            <ul className="lista-miembros">
                                {members.map((miembro, index) => (
                                <li key={index} className="miembro-item">
                                    {miembro}
                                </li>
                                ))}
                            </ul>
                            <button onClick={toggleModal} className="cerrar-modal">
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
        </div>
    ); 
}

//<Tarjeta grupoId={grupoId} /> ENTRE LOS ULTIMOS DIV
export default SingleGroup;
