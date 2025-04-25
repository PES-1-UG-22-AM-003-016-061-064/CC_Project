const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const cors = require('cors');


dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5005',
  credentials: true
}));


app.use(express.json());


console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));


app.use('/auth', authRoutes);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
