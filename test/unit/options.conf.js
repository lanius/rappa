basePath = '../../'

files = [
  MOCHA,
  MOCHA_ADAPTER,
  'extension/test/lib/chai.js',
  'extension/test/lib/sinon-1.5.2.js',
  'extension/test/lib/sinon-chai.js',
  'test/unit/config.js',

  'extension/common/*.js',
  'extension/options/lib/*.js',
  'extension/options/js/*.js',
  'test/lib/angular-mocks.js',
  'test/unit/options/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

reporters = ['progress', 'coverage'];

preprocessors = {
  '**/extension/options/js/*.js': 'coverage'
};

coverageReporter = {
    type : 'html',
    dir : 'coverage/'
};
