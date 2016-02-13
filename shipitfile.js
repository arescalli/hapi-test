var pkg = require('./package.json');
var name = "Test Hapi"
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/test-hapi-workspace',
      deployTo: '/home/aresk/apps/test-hapi',
      repositoryUrl: pkg.repository.url,
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2,
      key: '/Users/alessandro/.ssh/id_rsa',
      shallowClone: true
    },
    staging: {
      servers: 'aresk@192.168.1.13'
    }
  });

  shipit.task('npm-setup', function () {
    var r = shipit.remote('cd ' + shipit.config.deployTo + '/current && npm install');
    shipit.emit('npm-setupped');
    return r;
  });

  shipit.task('restart-app', function () {
    shipit.log('Starting application...');
    //return shipit.remote('pm2 start /home/aresk/apps/node-server-test/current/server.js');    
    return shipit.remote('pm2 restart "' + name + '"');
    // return shipit.remote('pm2 start /home/aresk/apps/node-server-test/current/server.js --watch');
  });

  shipit.task('setup-app', function () {
    shipit.log('Setupping application "' + name + '" with pm2...');
    // non uso --watch! 
    shipit.log();
    return shipit.remote('pm2 start ' + shipit.config.deployTo + '/current/server.js --name="' + name + '"');
  });

  shipit.on('deployed', function () {    
    shipit.start('npm-setup');
  });

  shipit.on('npm-setupped', function() {
    shipit.start('restart-app');
  });
};