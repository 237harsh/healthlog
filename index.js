require('dotenv').config()
const express = require('express')
const connectDB = require('./middlewares/db')

const app = express()
var cors = require('cors');
connectDB()
const corsOptions = {
  origin: 'https://healthy-frontend-neon.vercel.app',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
