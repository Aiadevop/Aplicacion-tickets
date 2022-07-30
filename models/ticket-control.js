const path = require ('path');
const fs = require('fs')

class Ticket {

    constructor(numero,escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }

}
class TicketControl {

    constructor() {

        this.ultimo = 0; //ultimo ticket que atendemos
        this.hoy = new Date().getDate(); //que dia es hoy
        this.tickets = []; //tickets pendientes
        this.ultimos4 = []; //los 4 que se muestran en pantalla

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    //Inicializa la clase o el servidor
    init(){
        const {hoy,tickets,ultimos4,ultimo}= require ('../db/data.json');

        //Si estamos en el día actual mantenemos los tickets, si no , los guardamos
        if(hoy === this.hoy){
            this.tickets= tickets;
            this.ultimo= ultimo;
            this.ultimos4= ultimos4
        }else{
            //Es otro día
            this.guardarDB();
        }
    }

    guardarDB() {

        const dbPath = path.join (__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente(){
        this.ultimo += 1;
        //Subimos un nuevo ticket
        //this.tickets.push(new Ticket (this.ultimo, null));
        const ticket = new Ticket (this.ultimo, null);
        this.tickets.push(ticket);
        console.log(ticket);

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket (escritorio){
        //No tenemos tickets
        if(this.tickets.length === 0){
            return null;
        }
        //Le doy el primer ticket
        const ticket = this.tickets.shift(); //borra el primer elemento del arreglo
        ticket.escritorio= escritorio;

        //añade un elemento nuevo al principio del arreglo
        this.ultimos4.unshift(ticket);

        if(this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1) //Corta la última posición
        }

        this.guardarDB();

        return ticket;
    }
}

module.exports = TicketControl;