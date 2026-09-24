const { calcularPrecoPrazo } = require('correios-brasil');

const args = {
  sCepOrigem: '01001000',
  sCepDestino: '01001000',
  nVlPeso: '1',
  nCdFormato: '1',
  nVlComprimento: '20',
  nVlAltura: '20',
  nVlLargura: '20',
  nCdServico: ['04510', '04014'],
  nVlDiametro: '0',
};

calcularPrecoPrazo(args)
  .then(response => console.log(response))
  .catch(err => console.error(err));
