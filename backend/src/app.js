const express = require('express');
const cors = require('cors');
const path = require('path');
const locationRoutes = require('../routes/locations');
const indicatorRoutes = require('../routes/indicators');
const digitalCollectionRoutes = require('../routes/digitalCollection');
const collaborationRoutes = require('../routes/collaboration');
const galleryRoutes = require('../routes/gallery');
const twinCityRoutes = require('../routes/twinCities');
const userRoutes = require('../routes/users');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas
app.use('/api/locations', locationRoutes);
app.use('/api/indicators', indicatorRoutes);
app.use('/api/digital-collection', digitalCollectionRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/twin-cities', twinCityRoutes);
app.use('/api/users', userRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app; 