import dotenv from "dotenv"
dotenv.config()

import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
// Route Import

import dashboardRoutes from "./routes/dashboardRoutes"
import productRoutes from "./routes/productsRoutes"
import userRoutes from "./routes/userRoutes"


// Configuration
const app = express()
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

//Routes
app.use("/dashboard",dashboardRoutes);
app.use("/products",productRoutes);
app.use("/users",userRoutes)


//Servers
const port=process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`server running on port ${port}`)
});
