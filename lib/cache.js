
module.exports = exports = cache
  
var versioning = require('./util/versioning.js')
  , path = require('path')
  , fs = require('fs')
  , mkdirp = require('mkdirp')

function cache(gyp, argv, callback) {
    debugger;
    var package_json = JSON.parse(fs.readFileSync('./package.json'));
    var opts = versioning.evaluate(package_json, gyp.opts);
    var cache_home = process.env.NODE_PRE_GYP_CACHE || getUserHome() + '/.node-pre-gyp/cache';
    var target = [cache_home, opts.remote_path, opts.package_name].join('/');

    mkdirp(path.dirname(target), function(err) {
        if (err) callback(err);
        copyFile(opts.staged_tarball, target, callback);
    });
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", done);

  var wr = fs.createWriteStream(target);
  wr.on("error", done);
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
