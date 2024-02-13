const mongoose = require("mongoose")

const dotenv = require("dotenv")
dotenv.config({path : "./config.env"})


const app = require("./app")


//console.log(process.env);

console.log(process.env.DATABASE);

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)

//console.log(DB);

mongoose.connect(DB).then(con => {
    //console.log(con.connections);
    console.log("databse connected");
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log("server started at port : " + PORT);
})