module.exports = function(config : any) {
    config.set({
      frameworks: ['jasmine'],
      browsers: ['ChromeHeadless'],  // Utiliza ChromeHeadless para las pruebas en CI o en modo sin cabeza
      plugins: [
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-jasmine-html-reporter'
      ],
      reporters: ['progress', 'kjhtml'],
      singleRun: true,  // Esto es importante para que las pruebas se ejecuten una vez y terminen
      autoWatch: false,  // No se necesita en un entorno CI
    });
  };
  