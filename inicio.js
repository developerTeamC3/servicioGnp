const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const sendRequest = require('./sendRequest');


app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


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
      let idMarca = auto["ARMADORA_ID"];
      if (!nombresMarcas.some(marca => marca.nombre === nombreMarca)) {
        nombresMarcas.push({ nombre: nombreMarca, id: idMarca });
      }
    });

    res.json(nombresMarcas);
    console.log(nombresMarcas);
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
    console.log(`Marca: ${marca}`); // Verifica el valor de marca

    autos.forEach(auto => {
      let nombreSubmarca = auto["CARROCERIA"];
      let idSubmarca = auto["CARROCERIA_ID"]; // Asume que existe una clave CARROCERIA_ID
      if (auto['ARMADORA_ID'] === marca && !nombresSubmarcas.some(submarca => submarca.nombre === nombreSubmarca)) {
        nombresSubmarcas.push({ nombre: nombreSubmarca, id: idSubmarca });
      }
    });

    res.json(nombresSubmarcas);
    console.log(nombresSubmarcas);
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
      let nombreVersion = auto["VERSION"];
      let idVersion = auto["VERSION_ID"]; // Asume que existe una clave VERSION_ID
      if (auto['ARMADORA_ID'] === marca && auto['CARROCERIA_ID'] === submarca && !versiones.some(version => version.nombre === nombreVersion)) {
        versiones.push({ nombre: nombreVersion, id: idVersion });
      }
    });

    res.json(versiones);
    console.log(versiones);
  });
});

app.post('/cotizar', (req, res) => {
  let paquete;
  switch (req.body.cobertura) {
    case 'Amplia':
      paquete = 'PRS0012275';
      break;
    case 'Limitada':
      paquete = 'PRS0012276';
      break;
    case 'Amplia GL':
      paquete = 'PRP0001787';
      break;
    case 'Premium':
      paquete = 'PRS0016864';
      break;
  }
  
  const data = {
    modelo: req.body.modelo,
    marca: req.body.marca,
    submarca: req.body.submarca,
    descripcion: req.body.descripcion,
    cobertura: req.body.cobertura,
    paquete: paquete,
    codigoPostal: req.body.codigoPostal,
    fchNacimiento: req.body.fchNacimiento.replace(/-/g, ''),
    sexo: req.body.sexo,
    edad: req.body.edad
  };
  console.log(data);

  sendRequest(data, (error, response) => {
    if (error) {
      console.error(error);
      return res.render('resultado', { error: 'Error al cotizar' });
    }
    res.render('resultado', { result: `Respuesta de cotización: ${response}` });
  });


  //res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});