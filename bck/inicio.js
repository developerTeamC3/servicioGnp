const express = require('express');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('formulario', { marcas: [] });
});

app.get('/marcas/:modelo', (req, res) => {
  const { modelo } = req.params;

  fs.readFile(`output${modelo}.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const autos = JSON.parse(data);
    const nombresMarcas = [];

    autos.forEach(auto => {
      let nombreMarca = auto["ARMADORA"];
      if (!nombresMarcas.includes(nombreMarca)) {
        nombresMarcas.push(nombreMarca);
      }
    });

    res.json(nombresMarcas);
  });
});

app.get('/submarcas/:modelo/:marca', (req, res) => {
  const { modelo, marca } = req.params;

  fs.readFile(`output${modelo}.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const autos = JSON.parse(data);
    const nombresSubmarcas = [];

    autos.forEach(auto => {
      if (auto['ARMADORA'] === marca) {
        const nombreSubmarca = auto['CARROCERIA'];
        nombresSubmarcas.push(nombreSubmarca);
      }
    });

    res.json(nombresSubmarcas);
  });
});

app.get('/version/:modelo/:marca/:submarca', (req, res) => {
  const { modelo, marca, submarca } = req.params;

  fs.readFile(`output${modelo}.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const autos = JSON.parse(data);
    const versiones = [];

    autos.forEach(auto => {
      if (auto['ARMADORA'] === marca && auto['CARROCERIA'] === submarca) {
        const version = auto['VERSION'];
        versiones.push(version);
      }
    });

    res.json(versiones);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});