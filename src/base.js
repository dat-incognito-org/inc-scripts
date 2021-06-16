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

let submitKey = async (account, tokenIDs, reset = false) => {
  const otaKey = account.key.base58CheckSerialize(3);
  let needSync = false;
  await account.rpc.submitKey(otaKey)
  // error usually indicates the key being submitted before. If so, only sync when "reset" flag is on
  .catch(_ => needSync = reset);
  if (needSync) {
    console.log("Start syncing UTXOs")
    await Promise.all(tokenIDs.map(t => account.fetchOutputCoins(t)))
  } else {
    // console.log("UTXO syncing is skipped");
  }
  account.isSubmitOtaKey = true;
}

let BaseFn = {
  async initIncognitoEnv(flags) {
    const nodeEndpoint = flags.endpoint || 'http://localhost:8334';
    Object.assign(this, { readCsv, submitKey })
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
  reset: flags.boolean({ char: 'r', description: 'activate to re-sync UTXOs for this token (default: false)', default: false }),
  fee: flags.string({ description: 'user-specified fee (must be number)', parse: fee => Number(fee), default: 0 }),
}
module.exports = { BaseFn, BaseFlags };