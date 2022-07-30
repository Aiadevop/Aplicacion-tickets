//FRONTEND

//Referencias HTML

const lblEscritorio = document.querySelector('h1') //mi primer h1
const btnAtender = document.querySelector('button') //mi primer h1
const lblAtendiendo = document.querySelector('small') //mi primer h1
const divAlerta = document.querySelector('.alert') //mi primer h1
const lblPendientes= document.querySelector('#lblPendientes')
const lblcola= document.querySelector('#lblCola')



console.log('Escritorio HTML');

//cogemos el parametro escritorio del url
const searchParams = new URLSearchParams(window.location.search);

//Funciona en mozzilla y chrome
if(!searchParams.has('escritorio')){

    window.location = 'index.html'; //nos devuelve al index si en el url no aparece el escritorio.
    throw new Error ('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = 'Escritorio ' + escritorio;

//divAlerta.style.display = 'none'


const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled=false;    
    
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled=true;
});

socket.on('borrar-alerta',()=>{
    divAlerta.style.display = 'none'
})

socket.on('tickets-pendientes',(payload)=>{
    if(payload === 0){
        lblPendientes.style.display='none';
        lblcola.style.display='none';
    }else {
        lblPendientes.style.display='';
        lblcola.style.display='';
        lblPendientes.innerText = payload + ' Tickets '; 
    }
})

btnAtender.addEventListener('click', () => {

    
    socket.emit( 'atender-ticket', {escritorio} , ( {ok, ticket} ) => {
        if(!ok){

            lblAtendiendo.innerText= 'En breve le atenderemos'            
            return divAlerta.style.display = ''
        }
        lblAtendiendo.innerText = 'Atendiendo a Ticket '+ ticket.numero;
        
    });   

});


