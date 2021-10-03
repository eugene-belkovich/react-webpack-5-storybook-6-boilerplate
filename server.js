'use strict';

const config = require('./config/config');
const NodeService = require('./internal/common/node-service');

const {example} = config;
if (!example) throw new Error('configuration cannot be null/undefined');

const PORT = example.port;

const express = require('express');
const path = require('path');

const app = express();

// Configure static resources
app.use(express.static(path.join(__dirname, '/docs')));

// Configure server-side routing
app.get('*', (req, res) => {
  const dist = path.join(__dirname, '/docs/index.html');
  res.sendFile(dist);
});

// Open socket
app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});
