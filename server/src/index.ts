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
import expenseRoutes from "./routes/expenseRoutes"


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
app.use("/dashboard",dashboardRoutes);//  http://localhost:800/dashboard
app.use("/products",productRoutes);//  http://localhost:800/products
app.use("/users",userRoutes)//  http://localhost:800/users
app.use("/expenses",expenseRoutes)//  http://localhost:800/expenses


//Servers
const port=process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`server running on port ${port}`)
});
