const { Command, flags } = require('@oclif/command')
const Inc = require('incognito');
const { SimpleWallet, init } = Inc;
const fs = require('fs-extra');

let readCsv = (filename) => {
    let csv = fs.readFileSync(filename).toString();
    var lines = csv.split("\n");

    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }
    return result;
}

let BaseFn = {
  async initIncognitoEnv(flags) {
    const nodeEndpoint = flags.endpoint || 'http://localhost:8334';
    this.readCsv = readCsv;
    this.Inc = Inc;
    this.inc = new SimpleWallet();
    this.inc.setProvider(nodeEndpoint);
    await init();
  },

  // basic error handler
  err(e) {
    console.error(e)
    throw e;
  }
}
let BaseFlags = {
  endpoint: flags.string({ char: 'e', description: 'node ip:port to connect to' }),
}
module.exports = { BaseFn, BaseFlags };