console.log('Nuevo Ticket HTML');
//Referencias HTML (aparecen en nuevo-ticket.html)
//Estas constantes hacen referencias a los objetos HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnCrear.disabled=false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnCrear.disabled=true;
});

socket.on('ultimo-ticket',(ultimo)=>{

    lblNuevoTicket.innerText = 'Ticket '+ ultimo; 
})


btnCrear.addEventListener('click', () => {

    //El null es porque no hay nada en el payload

    socket.emit( 'siguiente-ticket', null , ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
        console.log('Desde el server', ticket);
    });   

});

