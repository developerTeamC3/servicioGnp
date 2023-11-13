const request = require('request');
const xml2js = require('xml2js');
const fs = require('fs'); // Importa el módulo fs
require('dotenv').config(); // Importa el módulo dotenv

const url = 'https://api.service.gnp.com.mx/autos/wsp/catalogos/catalogo';

const usuario = process.env.USUARIO;
const password = process.env.PASSWORD;
const tipoCatalogo = 'VEHICULOS';
const idUnidadOperable = '';
const fecha = '21/01/2020';

const elementos = [
  {
    nombre: 'TIPO_VEHICULO',
    clave: 'AUT'
  },
  {
    nombre: 'MODELO',
    clave: '2023'
  }
];

let body = `<SOLICITUD_CATALOGO>\r\n    <USUARIO>${usuario}</USUARIO>\r\n    <PASSWORD>${password}</PASSWORD>\r\n    <TIPO_CATALOGO>${tipoCatalogo}</TIPO_CATALOGO>\r\n    <ID_UNIDAD_OPERABLE>${idUnidadOperable}</ID_UNIDAD_OPERABLE>\r\n    <FECHA>${fecha}</FECHA>\r\n    <ELEMENTOS>\r\n`;

elementos.forEach(elemento => {
  body += `        <ELEMENTO>\r\n            <NOMBRE>${elemento.nombre}</NOMBRE>\r\n            <CLAVE>${elemento.clave}</CLAVE>\r\n        </ELEMENTO>\r\n`;
});

body += '    </ELEMENTOS>\r\n</SOLICITUD_CATALOGO>';

const headers = {
  'Content-Type': 'application/xml;charset=UTF-8',
  'Content-Length': body.length,
  Authorization: 'Basic ' + Buffer.from('username:password').toString('base64')
};

const options = {
  url,
  method: 'POST',
  headers,
  body
};

request(options, (error, response, body) => {
  if (error) {
    console.error(error);
    return;
  }
  
  // Imprime el XML antes de parsearlo
  console.log(body);

  xml2js.parseString(body, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
  
    // Inicializa el array de salida
    const salida = [];
  
    // Diccionario de datos
    const diccionario = {
      "TIPO_VEHICULO": "",
      "TIPO_VEHICULO_ID": "",
      "ARMADORA": "",
      "ARMADORA_ID":"",
      "MODELO": "",
      "CARROCERIA": "",
      "CARROCERIA_ID":"",
      "VERSION": "",
      "VERSION_ID":"",
      "CLAVEMARCA": "",
      "ALTOVALOR": "",
      "ALTISIMOVALOR": ""
    };
  
    // Itera sobre cada objeto en el array ELEMENTOS
    result.CATALOGO.ELEMENTOS.forEach(elemento => {
      // Inicializa un objeto de auto
      const auto = { ...diccionario };
  
      // Itera sobre cada objeto en el array ELEMENTO
      elemento.ELEMENTO.forEach(subElemento => {
        // Añade la propiedad al auto si existe en el diccionario
        if (auto.hasOwnProperty(subElemento.NOMBRE)) {
          auto[`${subElemento.NOMBRE}`] = subElemento.VALOR;
        }
        // Añade la propiedad ID al auto si existe en el diccionario
        if (auto.hasOwnProperty(`${subElemento.NOMBRE}_ID`)) {
          auto[`${subElemento.NOMBRE}_ID`] = subElemento.CLAVE;
        }
      });
  
      // Añade el auto al array de salida
      salida.push(auto);
    });
  
    const json = JSON.stringify(salida, null, 2); // Define la variable json aquí
  
    // Guarda el resultado en un archivo JSON
    fs.writeFile('output2023.json', json, 'utf8', (err) => {
      if (err) {
        console.error(err);
        return;
      }
  
      console.log('Archivo JSON guardado con éxito.');
    });
  });
});