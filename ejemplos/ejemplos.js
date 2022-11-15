/* ----------------------    ---------------------- */    

//              CLASE SIETE

//const express = require('express')  Llamo a la libreria

//const app = express() inicializo

//const frase = "Hola mundo como estan"

//app.use(express.json())   Lineas para que el servidor interprete JSON automaticamente
//app.use(express.urlencoded({extended: true}))

// gets

//1) Obtener la frase
/* app.get('/api/frase', (req, res) => {
    res.json({
        frs: frase
    })
}) */

//2) obtener una letra de la frase

/* app.get('/api/letras/:num', (req, res) => {
    const { num } = req.params

    if (isNaN(num)) {
        return res.json( {error: "El parametro ingresado no es un numero"})
    }

    if (num < 1 || num > frase.length) {
        return res.json( {error: "El parametro ingresado esta fuera de rango"})
    }

    res.send(frase[num - 1])
}) */

//3) obtener una palabra de la frase
/* app.get('/api/palabras/:num', (req, res) => {
    const num = req.params.num

    if (isNaN(num)) {
        return res.json( {error: "El parametro ingresado no es un numero"})
    }

    const palabras = frase.split(' ')
    if (num < 1 || num > palabras.length) {
        return res.json( {error: "El parametro ingresado esta fuera de rango"})
    }

    res.send(palabras[num - 1])
}) */

// const PORT = 8080 Puerto
// const server = app.listen(PORT, () => {console.log('servidor escuchando en el puerto ' + PORT)}) Inicializo server 


//              EJERCICIO DOS

//const palabras = ["Frase", "inicial"]

// verbos

// Checkeo las frases

/* app.get('/api/frase', (req, res) => {
    res.json({ frase: palabras.join(' ') })
}) */

// Checkeo una palabra de la frase

/* 
app.get('/api/palabras/:num', (req, res) => {
    const { num } = req.params
    res.json({ buscada: palabras[parseInt(num) - 1] })
}) */

// Agrego una palabra

/* 
app.post('/api/palabras', (req, res) => {
    const { palabra } = req.body
    palabras.push(palabra)
    res.json({ agregada: palabra, posicion: palabras.length })
}) */

// Edito una palabra

/* app.put('/api/palabras/:num', (req, res) => {
    const { num } = req.params
    const { palabra } = req.body
    
    const palabraAnterior = palabras[parseInt(num) -1]
    palabras[parseInt(num) -1] = palabra

    res.json({ actualizada: palabra, anterior: palabraAnterior})
}) */

// Elimino una palabra

/* 
app.delete('/api/palabras/:num', (req, res) => {
    const { num } = req.params
    const palabraEliminada = palabras.splice(parseInt(num) - 1, 1)

    res.json({ borrada: palabraEliminada })
}) */

/* ----------------------    ---------------------- */    

//              CLASE OCHO

//          EJERCICIO UNO

// const { Router } = express

// app.use('/static', express.static(__dirname + '/public')) archivos estaticos
// Le estoy dando permiso a Express para que acceda a la informacion que esta dentro de "public"
//__dirname ruta absoluta, busca todas las carpetas/archivos desde antes y despues x ej: /users/delcampo/backend/clase8/public
//las rutas relativas busca desde donde estoy en adelante x ej: /clase8/public

// const mascotas = []
// const personas = []

// const routerMascotas = new Router() Creo una ruta para las peticiones de mascotas

/* routerMascotas.get('/', (req, res) => {
    res.json(mascotas)
}) */

/* routerMascotas.post('/', (req, res) => {
    mascotas.push(req.body)
    res.json({ok: 'ok'})
}) */

// const routerPersonas = new Router() Creo una ruta para las peticiones de personas

/* routerPersonas.get('/', (req, res) => {
    res.json(personas)
}) */

/* routerPersonas.post('/', (req, res) => {
    personas.push(req.body)
    res.json({ok: 'ok'})
}) */

// app.use('/mascotas', routerMascotas) 
//  Aviso que voy a usar las siguientes rutas
// app.use('/personas', routerPersonas)

//          EJERCICIO DOS 


// const multer = require('multer') importo el middleware multer


// config multer

/* const storage = multer.diskStorage({ donde se guarda el archivo
    destination: function (req, file, cb) { 
        cb(null, 'uploads') carpeta donde quiero guardar los archivos
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`) nombre del archivo
    }
})

const upload = multer({storage: storage}) Ejecuto la actualizacion  */ 

// end config multer

// const router = express.Router() declaro una ruta

/* router.post('/subir', upload.single('miArchivo ( nombre que defini en el HTML donde cargo el archivo ) '), (req, res) => {
    const file = req.file
    if (!file) {
        const error = new Error('Error, no se subio ningun archivo')
        res.send(error)
    }
    res.send('Archivo ' + file.originalname + ' se subio correctamente')
}) */

// app.use('/api/productos', router) inicio la ruta

