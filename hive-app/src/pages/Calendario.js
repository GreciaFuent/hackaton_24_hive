import "../styles/Calendario.css";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";

function Calendario() {
    const [events, setEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [filters, setFilters] = useState({ type: "all", group: "all" });
    const [selectedDate, setSelectedDate] = useState(null);
    const [month, setMonth] = useState(9); 
    const [year, setYear] = useState(2024);
    const [showMessage, setShowMessage] = useState(false);

    const idUser = localStorage.getItem("user");

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/fetchEvents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idUser }),
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data.map(event => ({
                    ...event,
                    type: String(event.type), // Asegurarse de que sea cadena
                })));
            } else {
                console.error("Error al obtener eventos");
            }
        } catch (error) {
            console.error("Error en la conexión al obtener eventos", error);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/fetchGroupsCalendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idUser }),
            });
            if (response.ok) {
                const data = await response.json();
                setGroups(data);
            } else {
                console.error("Error al obtener grupos");
            }
        } catch (error) {
            console.error("Error en la conexión al obtener grupos", error);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchGroups();
    }, []);

    const handleTypeChange = (type) => {
        setFilters({ type: String(type), group: "all" });
    };

    const handleGroupChange = (group) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            group: String(group),
        }));
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysOfWeek = ["DO", "LU", "MA", "MI", "JU", "VI", "SA"];

    const previousMonth = () => {
        setMonth(month === 0 ? 11 : month - 1);
        setYear(month === 0 ? year - 1 : year);
    };

    const nextMonth = () => {
        setMonth(month === 11 ? 0 : month + 1);
        setYear(month === 11 ? year + 1 : year);
    };

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.expiredDate);
        return (
            eventDate.getMonth() === month &&
            eventDate.getFullYear() === year &&
            (filters.type === "all" || event.type === filters.type) &&
            (filters.group === "all" || event.idGroup === filters.group)
        );
    });

    const filteredGroups = () => {
        return filters.type === "all"
            ? groups
            : groups.filter(group => 
                (filters.type === "1" && group.type === "academic") ||
                (filters.type === "0" && group.type === "personal")
            );
    };

    useEffect(() => {
        const handleResize = () => {
            setShowMessage(window.innerWidth >= 501 && window.innerWidth <= 900);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Ejecutar al cargar

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            <div className="calendario">
                <Header />
                <h1 className="titulo">Calendario</h1>

                <div className="filters">
                    <label htmlFor="typeFilter">Filtrar por tipo de evento:</label>
                    <select
                        id="typeFilter"
                        value={filters.type}
                        onChange={(e) => handleTypeChange(e.target.value)}
                    >
                        <option value="all">Todos</option>
                        <option value="1">Académico</option>
                        <option value="0">Personal</option>
                    </select>

                    {filters.type === "all" && (
                        <>
                            <label htmlFor="groupFilter">Filtrar por grupo:</label>
                            <select
                                id="groupFilter"
                                value={filters.group}
                                onChange={(e) => handleGroupChange(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                {filteredGroups().map((group, index) => (
                                    <option key={index} value={String(group.idGroup)}>
                                        {group.groupName}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className="main-container">
                    <div className="calendar-container">
                        <div className="calendar-navigation">
                            <button className="nav-button" onClick={previousMonth}>Anterior</button>
                            <span className="month-year">
                                {new Date(year, month).toLocaleString("es-ES", { month: "long" })} de {year}
                            </span>
                            <button className="nav-button" onClick={nextMonth}>Siguiente</button>
                        </div>

                        <div className="calendar-frame">
                            <div className="weekdays">
                                {daysOfWeek.map((day, index) => (
                                    <div key={index} className="weekday">{day}</div>
                                ))}
                            </div>

                            <div className="calendar">
                                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                                    <div key={index} className="calendar-day empty"></div>
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, day) => {
                                    const currentDay = day + 1;
                                    const dayEvents = filteredEvents.filter(event =>
                                        new Date(event.expiredDate).getDate() === currentDay
                                    );

                                    return (
                                        <div
                                            key={currentDay}
                                            className={`calendar-day ${dayEvents.length > 0 ? "event-day" : ""}`}
                                            onClick={() => setSelectedDate(currentDay)}
                                        >
                                            <span>{currentDay}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="event-details">
                        <h2>Detalles de eventos</h2>
                        {selectedDate && (
                            filteredEvents
                                .filter(event => 
                                    new Date(event.expiredDate).getDate() === selectedDate
                                )
                                .map((event, index) => (
                                    <div key={index} className="event-detail-item">
                                        <strong>{`${event.groupName} / ${event.type === "1" ? "Académico" : "Personal"}`}</strong><br />
                                        {event.title} - {event.information}
                                    </div>
                                ))
                        )}
                        {selectedDate && filteredEvents.filter(event => 
                            new Date(event.expiredDate).getDate() === selectedDate
                        ).length === 0 && (
                            <p>No hay eventos para este día.</p>
                        )}
                    </div>
                </div>
            </div>
            {showMessage && (
                <div className="no-format-message">
                    El formato de pantalla no es aceptado.
                </div>
            )}
        </div>
    );
}

export default Calendario;
