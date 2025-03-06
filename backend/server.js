require('dotenv').config();
const express = require('express');
const cors = require('cors');
const locationsRouter = require('./routes/locations');
const indicatorsRouter = require('./routes/indicators');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/locations', locationsRouter);
app.use('/api/indicators', indicatorsRouter);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do PIT-T está rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 