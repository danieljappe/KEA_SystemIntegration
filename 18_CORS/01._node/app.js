import express from 'express';
import cors from 'cors';

const app = express();

//app.use(cors());

const PORT = Number(process.env.PORT) || 8080

/*
app.use(cors({
    origin: '*', 
    methods: ['GET']
}))

*/

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/timestamp', /*cors(),*/ (req, res) => {
    res.send({ data: new Date() });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})