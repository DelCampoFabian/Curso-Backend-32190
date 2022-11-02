class usuario {
    constructor (nombre, apellido, libros, mascotas){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    } 
    getFullName() {
        return console.log(`Nombre completo: ${this.nombre} ${this.apellido}`)
    }
    addMascota(nuevaMascota){
        this.mascotas.push(nuevaMascota)
        return console.log(`Mascotas: ${this.mascotas}`)
    }
    countMascotas(){
        return console.log(`Cantidad mascotas: ${this.mascotas.length}`)
    }
    addBook(nombre, autor){
        this.libros.push(
            {
                nombre:nombre,
                autor:autor
            }
        )
    }
    getBookNames(){
        return this.libros.map((libros)=> libros.nombre)
    }
}1

const prueba = new usuario ("Fabián", "Del Campo", [{nombre:"Cronicas de una muerte anunciada", autor:"Gabriel Garcia Marquez"}], ["Oli","Mili","Luna"])
prueba.getFullName(prueba)
prueba.addMascota("Mascota Agregada")
prueba.countMascotas(prueba)
prueba.addBook("libro agregado","Un autor")
prueba.addBook("otro libro agregado","Otro autor")
prueba.getBookNames()


const libros = prueba.getBookNames()
console.log(libros) 