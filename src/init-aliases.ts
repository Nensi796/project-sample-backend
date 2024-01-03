import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@src': __dirname,
  '@api': __dirname + '/api',
  '@config': __dirname + '/config',
  '@gateway': __dirname + '/gateway',
  '@middlewares': __dirname + '/middlewares',
  '@operations': __dirname + '/operations',
  '@route': __dirname + '/route',
  '@utils': __dirname + '/utils',
  '@services': __dirname + '/services',
  '@validation': __dirname + '/validation',
});
