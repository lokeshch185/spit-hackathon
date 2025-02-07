const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Database connection
require('./models/dbConnection');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.set('trust proxy', true)

// Routes
const userRoutes = require('./routes/userRoutes');

app.use('/api/user', userRoutes);
app.get('/', (req,res)=> {
   res.send("I'm live!!");
})

// Start the server
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
