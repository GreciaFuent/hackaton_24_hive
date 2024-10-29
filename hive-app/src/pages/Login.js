import "../styles/Login.css"
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useEffect, useState } from 'react';


function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Inicializar useNavigate
  
  localStorage.setItem('user', '');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isRegistering) {
      // Lógica para el registro
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, email}),
      });

      if (response.ok) {
        alert('Usuario registrado con éxito');
        setIsRegistering(false); // Cambiar a login después de registrarse
      } else {
        alert('Error al registrar el usuario');
      }

      // Resetear los campos
      setName('');
      setEmail('');
      setUsername('');
      setPassword('');

    } else {
      // Lógica para el inicio de sesión
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('Inicio de sesión exitoso');
        localStorage.setItem('user', username);
        navigate('/principal'); // Redirige a la página principal
      } else {
        alert('Usuario o contraseña incorrectos');
      }

      // Resetear los campos
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="login">
      <div className="elementos_registro">
        <h1 className="titulo">{isRegistering ? 'Registro' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            {isRegistering && (
              <>
                <li>
                  <label htmlFor="nombre">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ingresa tu nombre"
                  />
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu email"
                  />
                </li>
              </>
            )}
            <li>
              <label htmlFor="username">Usuario:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
              />
            </li>
            <li>
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
              />
            </li>
          </ul>
          <button type="submit" className="button_ingresar">
            {isRegistering ? 'Registrar' : 'Ingresar'}
          </button>
          <button
            type="button"
            className="button_registrar"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
