require('dotenv').config()
const express = require('express')
const connectDB = require('./middlewares/db')

const app = express()
connectDB()
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: 'https://paramvs.site', // Replace with your actual Vercel domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Ensure preflight requests are handled
app.options('*', cors(corsOptions));

const port = 5000
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/data',require('./routes/symptom'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(` backend listening on port http://localhost:${port}`)
})
