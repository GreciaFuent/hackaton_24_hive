import "../styles/Principal.css";
import Tarjeta from "../components/Tarjeta";
import Header from "../components/Header";
import Nota from "../components/Nota";
import { useEffect, useState } from "react";

function Principal() {
  const [username, setUsername] = useState('');
  const [eventsFeed, setEventsFeed] = useState([]); // Nuevo state para los eventos
  const [notasFeed, setNotasFeed] = useState([]); // Notas

  const getEventsFeed = async () => {
    const username = localStorage.getItem('user');

    const response = await fetch('http://localhost:3001/api/getEventsFeed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); // Verifica en consola que data contiene los eventos correctamente
      setEventsFeed(data); // Guarda los eventos en el state
    } else {
      console.error("Error al obtener los eventos del feed");
    }
  };

  // obtener notas
  const getNotasFeed = async () => {
    const username = localStorage.getItem('user');
    const response = await fetch('http://localhost:3001/api/getNotesFeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data)
        setNotasFeed(data); // Actualiza el estado de notas con los datos recibidos
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log(storedUser);
      setUsername(storedUser);
    }

    getEventsFeed();
    getNotasFeed();
  }, []);

  return (
    <div className="principal">
      <Header />
      <h2>Bienvenido, {username}</h2>
      <div className="display_tarjetas">
        {eventsFeed.map((event, index) => (
           <Tarjeta
           key={event.id || index} // Usa `event.id` si está disponible, o `index` temporalmente
           title={event.title}
           description={event.information}
           group={event.groupName}
           date={event.expiredDate}
           usuario={event.idUser}
       />
        ))}
      </div>
      <div className="display_notas">
                {notasFeed.map((nota, index) => (
                    <Nota
                        key={nota.id || index}
                        description={nota.information}
                        fecha={nota.confirmatedDate}
                        onDelete={() => console.log("Eliminar nota con ID:", nota.id)}
                    />
                ))}
            </div>
    </div>
  );
}

export default Principal;
