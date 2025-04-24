import express from 'express';
import multer from 'multer';

const app = express();

const PORT = 8080;

app.use(express.urlencoded({extended: true}))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(undefined, './uploads')
    },
    filename: (req, file, cb) => {
        
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const uniqueFilename = `${uniquePrefix}__${file.originalname}`
        
        cb(undefined, uniqueFilename)
    }
})

function fileFilter (req, file, cb) {
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
    
    if (!validTypes.includes(file.mimetype)) {
        cb(new Error("FIle type not allowed" + file.mimetype), false)
    } else {
        cb(null, true)
    }
}

/*
const upload = multer({
    dest: 'uploads/'
    })
*/

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter
});

app.post('/form', (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

app.post('/fileform', upload.single('file'), (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
