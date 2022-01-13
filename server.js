
const express = require("express")
const bodyParser = require("body-parser")
const colors = require("colors")
const app = express()
const http = require('http');
const server = http.createServer(app);
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")
const {NotFound, errorHandler} = require("./middleware/errorHandler")
const ConnectToDB = require("./database/connection")
const PORT = process.env.PORT || 3000
const { Server } = require("socket.io");
const io = new Server(server);
const  notesRouter = require("./routes/notes.route")
const connectedUsers = []

dotenv.config()

const sequelize = ConnectToDB()
require("./database/models")(sequelize)
sequelize.sync()


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(cors())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'authorization');
  
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => res.sendFile("index.html"))
app.get('/user2', (req, res, next) => res.sendFile(path.join(__dirname, 'public')+"/user2.html"))

app.use('/notes', notesRouter(sequelize, io, connectedUsers).router)

app.use(NotFound)
app.use(errorHandler)

setInterval(()=> {
    notesRouter(sequelize, io, connectedUsers).getLastNotesStats()
}, 1000*60*60*24) // run everu day

io.on('connection', (socket) => {
    console.log(`a user connected`.blue.bold);

    // store user id of the connected user
    socket.on(`new_user`, (id) => connectedUsers.push({
        user_id: id,
        socketId: socket.id
    }))
});

server.listen(PORT, console.log(`Server Is Running on Port ${PORT}`.yellow.bold))