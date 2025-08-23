import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from './app/config/logger';
import swaggerSetup from './swagger';
import { initializeDatabase } from './app/models/database';
import index from './app/routes';

const app = express();

const init = await initializeDatabase();
if (init){
    logger.logger().info("Database initialized")
}else{
    logger.logger().info("Database Failed Connect")
}

app.use(cors())
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static('assets'))

app.use(cookieParser());
swaggerSetup(app)

const port = process.env.PORT ?? 3000;

app.use('/api', index);

app.listen(port, () =>{
    logger.logger().info(`Server is running on port ${port}`);
})