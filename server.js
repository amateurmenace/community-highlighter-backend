const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./api');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});