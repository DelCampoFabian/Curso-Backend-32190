const express = require(`express`);
const { Server: HttpServer } = require(`http`);
const { Server: IOServer } = require(`socket.io`);

const MessageDAOMongoDB = require(`./daos/MessageDAOMongoDB`);
const mongoose = require('mongoose');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static(`./public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set(`views`, `./views`);
app.set(`view engine`, `ejs`);

const PORT = 8081;
httpServer.listen(PORT, () => console.log(`Servidor escuchando el puerto ${PORT}`));

let users = [];

//CRUD db
const { selectAllProducts } = require(`./db/selectAllProducts`);
const { insertProduct } = require(`./db/insertProduct`);

//Routers import
const homeRouter = require(`./routers/homeRouter`);
const formRouter = require(`./routers/formRouter`);
const loginRouterGet = require(`./routers/loginRouterGet`);
const loginRouterPost = require(`./routers/loginRouterPost`);
const chatRouter = require(`./routers/chatRouter`);
const fakerRouter = require(`./routers/fakerRouter`);

//Routers
app.use(`/`, homeRouter);
app.use(`/form`, formRouter);
app.use(`/login`, loginRouterGet);
app.use(`/login`, loginRouterPost);
app.use(`/chat`, chatRouter);
app.use(`/api/productos-test`, fakerRouter);

//Instancia contenedores:
const storageMessages = new MessageDAOMongoDB();


// ----------------------------------- Desafio 13 ----------------------------
const session = require('express-session');
const flash = require('connect-flash');


const { createHash, isValidPassword } = require('./utils/utils');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const MongoStore = require(`connect-mongo`);
const UserModel = require('./db/models/user');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/desafio11",
        ttl: 10,
    }),
    secret: '123456',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use('login', new LocalStrategy({
    //Configuración para obtener todo el req.
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return done(null, false);
        }
        if (!isValidPassword(user.password, password)) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (err) {
        done(err);
    }
}));

passport.use('signup', new LocalStrategy({
    //Configuración para obtener todo el req.
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        const user = await UserModel.findOne({ username });
        if (user) {
            return done(null, false);
        }

        const newUser = new UserModel();
        newUser.username = username;
        newUser.password = createHash(password);
        newUser.email = req.body.email;

        const userSave = await newUser.save();

        return done(null, userSave);
    }
    catch (err) {
        done(err);
    }
}));

passport.serializeUser((user, done) => {
    console.log(`serializeUser`);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    console.log(`deserializeUser`);
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/login2', (req, res) => {
    return res.render('loginSession');
});

app.get('/signup2', (req, res) => {
    return res.render('signup')
});

app.get(`/bienvenida`, (req, res) => {
    userLog = req.user.username;
    res.render(`bienvenida`, { userLog });
});

app.get(`/errorLog`, (req, res) => {
    res.render(`errorLog`);
});

app.get(`/errorSignup`, (req, res) => {
    res.render(`errorSignup`);
});

app.get(`/logout`, (req, res) => {
    if (req.user) {
        userLogout = req.user.username;
        res.render(`logout`, { userLogout });
        req.session.destroy(err => {
            if (!err) {
                console.log(`ok`)
            } else {
                console.log(`error`)
            }
        });
    }
    res.render(`errorLog`);
});


app.post('/login2', passport.authenticate('login', { 
    successRedirect: '/bienvenida', 
    failureRedirect: `/errorLog`,
    failureFlash: true 
}));

app.post('/signup2', passport.authenticate('signup', {
    successRedirect: '/', 
    failureRedirect: `/errorSignup`, 
    failureFlash: true 
}));

// ----------------------------------- Desafio 13 ----------------------------


//socket Products
io.on(`connection`, socket => {
    socket.on(`sendProduct`, async () => {
        try {
            const allProductsFromDB = await selectAllProducts();

            //Servidor --> Cliente : Se envian todos los mensajes al usuario que se conectó.
            socket.emit(`allProducts`, allProductsFromDB);
        } catch (err) {
            console.log(`Error ${err}`);
        }
    });

    socket.on(`addProducts`, async data => {
        try {
            const newProducto = {
                title: `${data.name}`,
                price: Number(data.price),
                thumbnail: `${data.img}`
            };

            const product = await insertProduct(newProducto);

            //Envio el producto nuevo a todos los clientes conectados
            io.sockets.emit(`refreshTable`, [product]);

        } catch (err) {
            console.log(`Error ${err}`);
        }
    });
});

//socket chat
io.on(`connection`, socket => {
    //Cliente --> Servidor: joinChat event
    socket.on(`joinChat`, async ({ aliasName }) => {
        users.push({
            id: socket.id,
            aliasName: aliasName,
            avatar: "https://cdn-icons-png.flaticon.com/512/456/456141.png"
        });

        //Servidor --> Cliente : bienvenida al usuario que se conecta.
        socket.emit(`notification`, `Bienvenido ${aliasName}`);

        try {
            //const allMessageFromDB = await selectAllMessage();
            const allMessageFromDB = await storageMessages.getAll();


            //Servidor --> Cliente : Se envian todos los mensajes al usuario que se conectó.
            socket.emit(`allMenssage`, allMessageFromDB);
        } catch (err) {
            return res.status(404).json({
                error: `Error ${err}`
            });
        }

        //Servidor --> Cliente : bienvenida a todos los usuarios menos al que inicio la conexión:
        socket.broadcast.emit(`notification`, `${aliasName} se ha unido al chat`);

        //Servidor --> cliente: enviamos a todos los usuarios la lista actualizada de participantes:
        io.sockets.emit(`users`, users);
    });

    //Cliente --> Servidor: messageInput event
    socket.on(`messageInput`, async data => {
        const user = users.find(user => user.id === socket.id);

        const newMessage = {
            author: {
                id: user.aliasName,
                nombre: ` Nombre del usuario`,
                apellido: ` Apellido del usuario`,
                edad: ` Edad`,
                alias: ` alias del usuario`,
                avatar: ` url avatar`
            },
            text: {
                id: mongoose.Types.ObjectId(),
                mensaje: data,
            }
        }

        await storageMessages.save(newMessage);

        //Servidor --> Cliente: envio mensaje
        socket.emit(`message`, newMessage);

        socket.broadcast.emit(`message`, newMessage);
    });

    // Cliente --> Servidor: un cliente se desconecta.
    socket.on('disconnect', reason => {
        const user = users.find(user => user.id === socket.id);
        users = users.filter(user => user.id !== socket.id);

        if (user) {
            socket.broadcast.emit(`notification`, `${user.aliasName} se ha ido del chat`);
        }

        io.sockets.emit(`users`, users);
    });
});