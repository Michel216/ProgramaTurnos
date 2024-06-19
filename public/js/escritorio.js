document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('connect', () => {
        console.log('Conectado al servidor');
    });

    socket.on('disconnect', () => {

        console.log('Desconectado del servidor');
    })

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nombre = urlParams.get('escritorio');

    if (nombre) {
        document.getElementById('usuario').textContent = `${nombre}`;
    } else {
        document.getElementById('usuario').textContent = 'Escritorio';
    }

    function actualizarTurnos(ticketsArray) {
        const turnosElement = document.getElementById("turnos");
        turnosElement.textContent = ticketsArray.length;

        const alerta = document.getElementById("alerta");
        if (ticketsArray.length === 0) {
            alerta.style.display = "block";
            turnosElement.style.display = "none";
        } else {
            alerta.style.display = "none";
            turnosElement.style.display = "block";
        }
    }

    function mostrarUltimosTickets(ultimos4) {
        for (let i = 0; i < 4; i++) {
            const ticket = ultimos4[i];
            const ticketElement = document.getElementById(`lblTicket${i + 1}`);
            const escritorioElement = document.getElementById(`lblEscritorio${i + 1}`);
            if (ticket) {
                ticketElement.textContent = `Ticket ${ticket.numero}`;
                escritorioElement.textContent = `Escritorio ${ticket.escritorio || ''}`;
            } else {
                ticketElement.textContent = '';
                escritorioElement.textContent = '';
            }
        }
    }

    socket.on('tickets', (ticketsArray) => {
        console.log('Tickets recibidos:', ticketsArray);
        actualizarTurnos(ticketsArray);
    });

    socket.on('last4', (ultimos4) => {
        console.log('Últimos 4 tickets:', ultimos4);
        mostrarUltimosTickets(ultimos4);
    });


    document.getElementById('nextTicket').addEventListener('click', () => {
        socket.emit('nextTicket', { escritorio: nombre }, (data) => {
            if (data.ticket) {
                document.getElementById("turnoDe").textContent = `Ticket ${data.ticket}`;
            }
            socket.emit('getLast4');
            socket.emit('getTickets');
        });
        socket.on('playAudio', () => {
            const audio = new Audio('/audio/new-ticket.mp3'); // Ruta relativa al archivo de audio
            audio.play();
        });

    });
    socket.emit('getTickets');
    socket.emit('getLast4');

});