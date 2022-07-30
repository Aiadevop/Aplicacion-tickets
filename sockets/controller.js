//BACKEND

const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();


const socketController = (socket) => {   

    socket.emit('ultimo-ticket',ticketControl.ultimo );
    socket.emit('estado-actual',ticketControl.ultimos4);
    socket.emit('tickets-pendientes',ticketControl.tickets.length);
    socket.emit('borrar-alerta',);
    
    
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        
        //TODO Notificar que hay un nuevo ticket pendiente para asignar.
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.broadcast.emit('borrar-alerta',);
        
    })
    
    socket.on('atender-ticket', ( {escritorio}, callback ) => {
        
        if(!escritorio){
            return callback({
                ok:false,
                msg: 'No hay un escritorio asignado'
            });
        }
        
        const ticket = ticketControl.atenderTicket(escritorio);        

        //TODO notificar cambio en los últimos 4
        socket.broadcast.emit('estado-actual',ticketControl.ultimos4);
        socket.emit('tickets-pendientes',ticketControl.tickets.length);

        if(!ticket){
            callback({
                ok:false,
                msg:'Ya no hay tickes pendientes'
            })
        }else{
            console.log(ticket);
            callback({
                ok:true,
                ticket
            })
        }
 
     })
}



module.exports = {
    socketController
   
}

