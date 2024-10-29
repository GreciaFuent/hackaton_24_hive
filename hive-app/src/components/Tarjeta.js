import "../styles/Tarjeta.css";

function Tarjeta({ title, description, group, date, usuario}) {
    return (
        <div className="tarjeta-container">
            <div className="tarjeta">
                <div className="grupo-fecha">
                    Grupo: {group} <br />
                    Fecha: {date}
                </div>
                <h1>{title}</h1>
                <p>{description}</p>
                <div className="footer">
                    <span>Evento creado por {usuario}</span>
                </div>
            </div>
        </div>
    );
}

export default Tarjeta;
