document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    socket.on('connect', () => {
        console.log('Conectado al servidor');
    });
    socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
    });
    socket.on('last4', (ultimos4) => {
        console.log('Últimos 4 tickets:', ultimos4);
        mostrarUltimosTickets(ultimos4);
    });

    function mostrarUltimosTickets(ultimos4) {
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`lblTicket${i}`).textContent = '';
            document.getElementById(`lblEscritorio${i}`).textContent = '';
        }

        ultimos4.forEach((ticket, index) => {
            document.getElementById(`lblTicket${index + 1}`).textContent = `Ticket ${ticket.numero}`;
            document.getElementById(`lblEscritorio${index + 1}`).textContent = `Escritorio ${ticket.escritorio || ' '}`;
        });
        // io.emit('playAudio')
    }
});