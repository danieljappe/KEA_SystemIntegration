import express from 'express';
import usersRouter from './routers/usersRouter.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json());
app.use(usersRouter);

const swaggerDefinition = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Users API",
            version: "0.0.1",
            description: "A simple API to get information about users."
        }
    },
    apis: ["./routers/*Router.js"]
}

const swaggerOptions = {
    swaggerDefinition,
    apis: ["./routers/*Router.js"]
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {console.log("Server is running on port", PORT);});
