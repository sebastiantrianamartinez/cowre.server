const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');

const initRoutes = require('./routes');

const app = express();
const port = process.env.PORT || 4008;

app.use(cors());
app.use(express.json({ strict: false }));

initRoutes(app);

app.listen(port, () => {
    console.log('Server running on port: ' + port);
});
