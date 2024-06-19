document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('connect', () => {
        console.log('Conectado al servidor');
    });

    socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
    });

    document.getElementById('btnNuevoTicket').addEventListener('click', () => {
        socket.emit('newTicket', (nuevoNumeroTicket) => {
            document.getElementById('lblNuevoTicket').textContent = `Ticket ${nuevoNumeroTicket}`;
        });
    });
});