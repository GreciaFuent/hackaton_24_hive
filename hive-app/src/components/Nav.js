// Nav.js
import "../styles/Nav.css";

function Nav() {
  const cerrar = () => {
    if (window.innerWidth < 900) {
      const nav = document.querySelector("nav");
      nav.classList.remove("show"); 
    }
  };


    return (
        <nav className="nav">
            <button className="close" onClick={cerrar}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
            <ul>
                <a href="/grupos-generales"><li>Grupos</li></a>
                <a href="/notas"><li>Notas</li></a>
                <a href="/calendario"><li>Calendario</li></a>
            </ul>
        </nav>
    )

}

export default Nav;
