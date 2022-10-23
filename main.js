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
        let nombresLibros = []
        for(let i= 0; i < this.libros.length; i++){
            nombresLibros.push(this.libros[i].nombre)
        }
        
        return console.log(nombresLibros) 
    }
}

const prueba = new usuario ("Fabián", "Del Campo", [{nombre:"Cronicas de una muerte anunciada", autor:"Gabriel Garcia Marquez"}], ["Oli","Mili","Luna"])
prueba.getFullName(prueba)
prueba.addMascota("Mascota Agregada")
prueba.countMascotas(prueba)
prueba.addBook("libro agregado","Un autor")
prueba.getBookNames()


