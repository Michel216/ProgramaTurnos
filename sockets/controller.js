let ultimo = 0;
let ticketsArray = [];
let ultimos4 = [];
let escritorio = ""

export const socketController = (socket, io) => {
    console.log('Cliente conectado', socket.id);

    socket.on('newTicket', (callback) => {
        ultimo++;
        const newTicket = { numero: ultimo };
        ticketsArray.push(newTicket);
        callback(newTicket.numero);
        socket.emit('newTicket', newTicket);
        actualizarTickets(io);
    });

    socket.emit('last4', ultimos4);
    socket.emit('tickets', ticketsArray);
    socket.on('escritorio', (nombreEscritorio) => {
        escritorio = nombreEscritorio;
    });

    socket.on('nextTicket', (data, callback) => {
        if (ticketsArray.length > 0) {
            const nextTicket = ticketsArray.shift();0
            nextTicket.escritorio = data.escritorio;
            ultimos4.unshift(nextTicket);
            if (ultimos4.length > 4) {
                ultimos4.pop();
            }
            io.emit('last4', ultimos4);
            io.emit('tickets', ticketsArray);
            callback({
                ticket: nextTicket.numero,
                escritorio: escritorio,
            });
            io.emit('playAudio')
        } else {
            callback({ msg: 'No hay más tickets' });
        }
    });
    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });
};

function actualizarTickets(io) {
    io.emit('last4', ultimos4);
    io.emit('tickets', ticketsArray);
}
