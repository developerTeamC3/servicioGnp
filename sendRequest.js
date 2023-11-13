const request = require('request');
require('dotenv').config();


const usuario = process.env.USUARIO;
const password = process.env.PASSWORD;

const url = 'https://api.service.gnp.com.mx/autos/wsp/cotizador/cotizar';

function sendRequest(data, callback) {
  let body = `<COTIZACION>
    <SOLICITUD>
        <USUARIO>${usuario}</USUARIO>
        <PASSWORD>${password}</PASSWORD>
        <ID_UNIDAD_OPERABLE>NOP0000034</ID_UNIDAD_OPERABLE>
        <FCH_INICIO_VIGENCIA>20231030</FCH_INICIO_VIGENCIA>
        <FCH_FIN_VIGENCIA>20241030</FCH_FIN_VIGENCIA>
        <VIA_PAGO>IN</VIA_PAGO>
        <PERIODICIDAD>A</PERIODICIDAD>
        <ELEMENTOS>
            <ELEMENTO>
                <NOMBRE>CODIGO_PROMOCION</NOMBRE>
                <CLAVE>COP0000064</CLAVE>
                <VALOR>COP0000064</VALOR>
            </ELEMENTO>
        </ELEMENTOS>
    </SOLICITUD>
    <VEHICULO>
        <SUB_RAMO>01</SUB_RAMO>
        <TIPO_VEHICULO>AUT</TIPO_VEHICULO>
        <MODELO>${data.modelo}</MODELO>
        <ARMADORA>${data.marca}</ARMADORA>
        <CARROCERIA>${data.submarca}</CARROCERIA>
        <VERSION>${data.descripcion}</VERSION>
        <USO>01</USO>
        <FORMA_INDEMNIZACION>03</FORMA_INDEMNIZACION>
        <VALOR_FACTURA></VALOR_FACTURA>
    </VEHICULO>
    <CONTRATANTE>
    <TIPO_PERSONA>F</TIPO_PERSONA>
    <NOMBRES>PRUEBAA</NOMBRES>
    <APELLIDO_PATERNO>PRUEBAA</APELLIDO_PATERNO>
    <APELLIDO_MATERNO>PRUEBAA</APELLIDO_MATERNO>
    <EDAD>${data.edad}</EDAD>
    <RFC>PUPP930501ABC</RFC>
    <CVE_CLIENTE_ORIGEN>0000000000</CVE_CLIENTE_ORIGEN>
    <CODIGO_POSTAL>${data.codigoPostal}</CODIGO_POSTAL>
</CONTRATANTE>
<CONDUCTOR>
    <FCH_NACIMIENTO>${data.fchNacimiento}</FCH_NACIMIENTO>
    <SEXO>${data.sexo}</SEXO>
    <EDAD>${data.edad}</EDAD>
    <CODIGO_POSTAL>${data.codigoPostal}</CODIGO_POSTAL>
</CONDUCTOR>
<PAQUETES>
    <PAQUETE>
        <CVE_PAQUETE>PRS0012275</CVE_PAQUETE>
        <DESC_PAQUETE>${data.cobertura}</DESC_PAQUETE>
        <COBERTURAS/>
    </PAQUETE>
</PAQUETES>
  </COTIZACION>`;

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
      callback(error);
    } else {
      callback(null, body);
    }
  });
}

module.exports = sendRequest;