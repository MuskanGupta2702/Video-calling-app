const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server);
const {v4: uuidv4} = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug : true});

const hostname = '127.0.0.1';
const port = 8080 || process.env.PORT;

app.use('/peerjs', peerServer);

// For serving Public files
app.use(express.static('public'))

// Set the template engine as ejs
app.set('view engine', 'ejs')

// Set the views directory
// app.set('views', path.join(__dirname, 'views'))

app.get("/", (req,res) => {
    // res.send("This is homepage of my first express app")
    // res.render('zoom');
    res.redirect(`/${uuidv4()}`)
});

app.get('/:room' , (req, res) =>{
    // console.log(req.params);
    
    res.render('room', { roomID : req.params.room})
})

io.on('connection', socket =>{
    socket.on('join-room', (roomID, userId)=>{
        console.log('Joined Room');
        socket.join(roomID);
        // socket.to(roomId).broadcast.emit('user-connected');
        socket.broadcast.to(roomID).emit('user-connected', userId);

        socket.on('message', message =>{
            io.to(roomID).emit('createMessage', message);
        })
    })
})

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});
