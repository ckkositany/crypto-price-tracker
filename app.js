import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
import { createServer } from "http"
import path from "path"
import { Server } from "socket.io"

dotenv.config({path: './config.env'})

const app = express()
const server = createServer(app)
const io = new Server(server)
const port = process.env.PORT
const crypto_url = process.env.CRYPTO_URL

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));


app.get("/", (req,res)=>{
    //console.log(req.body);
    res.render("index.ejs")
})

io.on('connection', (socket) => {
    console.log('New client connected');
  
    const fetchCryptoPrices = async () => {
      try {
        const response = await axios.get(crypto_url);
        console.log(response.data);
        
        socket.emit('cryptoData', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchCryptoPrices();
    const intervalId = setInterval(fetchCryptoPrices, 10000); // Fetch every 10 seconds
  
    socket.on('disconnect', () => {
      clearInterval(intervalId);
      console.log('Client disconnected');
    });
  });












server.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);  
})
