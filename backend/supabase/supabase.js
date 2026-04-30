// const connectToMongo = require("./db");
const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');
const checkSupabase = require('./supabasedb');
// connectToMongo();
checkSupabase();
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const port = process.env.PORT || 8001;

//use cors middleware
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/', (req, res) => {
    res.send('Backend is running')

})

app.listen(port, () => {
    console.log(`Server is running on port ${port} : http://localhost:${port}`)
})

io.on('connection', (socket) => {
    console.log('User connected : ', socket.id);

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('message', data);
    })
    socket.on('disconnect', () => {
        console.log('user A disconnected id : ', socket.id);

    })
})