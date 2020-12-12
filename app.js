const mongoose = require("mongoose")
const express=require("express")
const app = express()
const path = require("path")
const exphbs = require("express-handlebars")
const studentRoute= require("./controllers/student")
const bodyParser = require("body-parser")
// DB connection using mongoose
mongoose.connect('mongodb://localhost:27017/student', 
{useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("DB CONNECTED")
})

//setting up express handlebars
app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({extname:'hbs',defaultLayout:'mainLayout',layoutsDir:__dirname+'/views/layouts/'}))
app.set('view engine', 'hbs');

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

//api routes
app.use("/api",studentRoute)

app.listen(process.env.PORT || 3000,()=>{
 console.log("Express server started at port: 3000")
})