import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Grupos.css";
import Header from "../components/Header";

function Grupos() {
  const navigate = useNavigate(); 
  const [activeSection, setActiveSection] = useState(null);
  const [grupos, setGrupos] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({
    title: "",
    integrantes: [], 
    tipo: "Personal",
  });
  const [integranteInput, setIntegranteInput] = useState(""); 
  const [codigoGrupo, setCodigoGrupo] = useState(""); // Nuevo estado para el código del grupo
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // Modal para unirse a grupo

  localStorage.setItem('group', "");

  const fetchGrupos = async () => {
    let username = localStorage.getItem('user');

    const response = await fetch('http://localhost:3001/api/fetch-groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const formattedGroups = data.map(grupo => ({
        ...grupo,
        tipo: grupo.type === 0 ? "Personal" : "Académico",
      }));
      setGrupos(formattedGroups);
    }
  };

  const linkPeople = async () => {
    let idUser = localStorage.getItem('user');
    const idGroup = codigoGrupo; // Tomar el código ingresado en el modal

    const response = await fetch('http://localhost:3001/api/linkPeople', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUser, idGroup }),
    });

    if (response.ok) {
      alert("Te has unido correctamente al grupo.");
    } else {
      alert("Oh, ha pasado algún error al unirte.");
    }
    setIsJoinModalOpen(false); // Cerrar modal al unirse
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const abrirModal = () => {
    setActiveSection(null);
    setIsModalOpen(true);
    setNuevoGrupo({ title: "", integrantes: [], tipo: "Personal" }); 
    setIntegranteInput("");
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  const abrirJoinModal = () => {
    setIsJoinModalOpen(true); 
  };

  const cerrarJoinModal = () => {
    setIsJoinModalOpen(false); 
  };

  const handleInputChange = (e) => {
    setNuevoGrupo({
      ...nuevoGrupo,
      [e.target.name]: e.target.value,
    });
  };

  const agregarIntegrante = () => {
    if (integranteInput.trim() !== "") {
      setNuevoGrupo((prev) => ({
        ...prev,
        integrantes: [...prev.integrantes, integranteInput],
      }));
      setIntegranteInput(""); 
    }
  };

  const eliminarIntegrante = (index) => {
    setNuevoGrupo((prev) => {
      const newIntegrantes = prev.integrantes.filter((_, i) => i !== index);
      return { ...prev, integrantes: newIntegrantes };
    });
  };

  const agregarGrupo = async () => {
    let userId = localStorage.getItem('user');
    const fechaCreacion = new Date().toISOString(); 
    userId = localStorage.getItem('user');

    const nuevoGrupoObj = {
      title: nuevoGrupo.title,
      tipo: nuevoGrupo.tipo,
      fechaCreacion: fechaCreacion,
      userId: userId,
    };
    
    try {
      const response = await fetch("http://localhost:3001/api/registerGroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoGrupoObj),
      });

      if (response.ok) {
        alert('Grupo registrado con éxito');
      } else {
        alert('Error al registrar el grupo.');
      }

      cerrarModal(); 
      fetchGrupos();
    } catch (error) {
      console.error("Error al agregar el grupo:", error);
    }
  };

  const handleNavigate = (id, nombre) => {
    localStorage.setItem('group', nombre.idGroup);
    navigate(`/grupo`);
  };

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index); 
  };

  return (
    <div className="grupos">
      <Header />
      <h1 className="titulo">Grupos a los que perteneces</h1>

      <button onClick={abrirModal} className="crear-grupo-btn">
        Crear Nuevo Grupo
      </button>

      <button onClick={abrirJoinModal} className="crear-grupo-ingresar">
        Ingresar a un Grupo
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nuevo Grupo</h2>
            <input
              type="text"
              name="title"
              placeholder="Nombre del grupo"
              value={nuevoGrupo.title}
              onChange={handleInputChange}
            />
            <ul>
              {nuevoGrupo.integrantes.map((integrante, index) => (
                <li key={index}>
                  {integrante}
                  <button onClick={() => eliminarIntegrante(index)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <label>
              Tipo de grupo:
              <select
                name="tipo"
                value={nuevoGrupo.tipo}
                onChange={handleInputChange}
              >
                <option value="Personal">Personal</option>
                <option value="Académico">Académico</option>
              </select>
            </label>
            <button onClick={agregarGrupo}>Agregar Grupo</button>
            <button onClick={cerrarModal}>Cancelar</button>
          </div>
        </div>
      )}

      {isJoinModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Unirse a un Grupo</h2>
            <input
              type="text"
              placeholder="Código del grupo"
              value={codigoGrupo}
              onChange={(e) => setCodigoGrupo(e.target.value)}
            />
            <button onClick={linkPeople}>Unirse</button>
            <button onClick={cerrarJoinModal}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="grupo-categorias">
        <h2 className="h2_personales" onClick={() => toggleSection(0)}>
          Grupos Personales
          <span className="toggle-icon">
            {activeSection === 0 ? "▲" : "▼"}
          </span>
        </h2>
        {activeSection === 0 && (
          <div className="grupo-list">
            {grupos.filter(grupo => grupo.tipo === "Personal").map((grupo, index) => (
              <div key={index} className="grupo-item">
                <div className="grupo-title" onClick={() => handleNavigate(grupo.id, grupo)}>
                  {grupo.groupName}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="h2_academicos" onClick={() => toggleSection(1)}>
          Grupos Académicos
          <span className="toggle-icon">
            {activeSection === 1 ? "▲" : "▼"}
          </span>
        </h2>
        {activeSection === 1 && (
          <div className="grupo-list">
            {grupos.filter(grupo => grupo.tipo === "Académico").map((grupo, index) => (
              <div key={index} className="grupo-item">
                <div className="grupo-title" onClick={() => handleNavigate(grupo.id, grupo)}>
                  {grupo.groupName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Grupos;
