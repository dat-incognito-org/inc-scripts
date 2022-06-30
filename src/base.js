const { Command, flags } = require('@oclif/command')
const Inc = require('incognito');
const fs = require('fs-extra');
const { cli } = require('cli-ux');

const DEFAULT_ENDPOINT = 'https://beta-fullnode.incognito.org/fullnode';

let readCsv = (filename) => {
  let csv = fs.readFileSync(filename).toString();
  var lines = csv.split("\n").map(line => line.trim());

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

let submitKey = async (account, tokenIDs, auth = null) => {
  await account.submitKey(auth)
    // error usually indicates the key being submitted before. If so, only sync when "reset" flag is on
    .catch(_ => console.error);
}

let truncateStr = (key, flags = {}) => flags.csv ? key : key.slice(0, 10) + '..' + key.slice(key.length - 10);

let showTx = (txResult, flags = {}) => {
  console.log(`Transaction ${txResult.Hash} for token: ${txResult.TokenID || '<PRV>'}`);
  if (txResult.Metadata) {
    console.log('Metadata:');
    console.log(txResult.Metadata);
  }
  let rows = [];
  let inps = txResult.Inputs;
  let outs = txResult.Receivers;
  if (txResult.TokenInputs && txResult.TokenInputs.length > 0) {
    inps = txResult.TokenInputs;
    outs = txResult.TokenReceivers;
  }
  rows = rows.concat(inps.map(inputCoin => ({
    type: 'IN',
    key: inputCoin.PublicKey,
    message: inputCoin.Info,
    amount: inputCoin.Value,
  })));
  rows = rows.concat(outs.map(pi => ({
    type: 'OUT',
    key: pi.PaymentAddress,
    message: pi.Message || '',
    amount: pi.Amount,
  })))
  console.log('Coin transfers\n');
  cli.table(rows, {
    type: { minWidth: 7 },
    key: {
      minWidth: 28,
      get: row => {
        return truncateStr(row.key, flags);
      }
    },
    amount: { minWidth: 14 },
    message: { extended: true }
  }, flags)
}

let BaseFn = {
  async initIncognitoEnv(flags) {
    const nodeEndpoint = flags.endpoint || DEFAULT_ENDPOINT;
    let shards = nodeEndpoint.includes('local') ? 1 : 8;
    Object.assign(this, { readCsv, submitKey, truncateStr, showTx })
    this.Inc = Inc;
    await this.Inc.init();
    await this.Inc.wasm.setShardCount('', shards);
    this.inc = new this.Inc.SimpleWallet();
    this.inc.setProvider(nodeEndpoint);    
  },

  // basic error handler
  err(e) {
    console.error(e)
    throw e;
  }
}
let BaseFlags = {
  endpoint: flags.string({ char: 'e', description: 'node ip:port to connect to' }),
  reset: flags.string({ char: 'r', description: 'activate to re-sync UTXOs for this token (default: false)', default: null }),
  fee: flags.string({ description: 'user-specified fee (must be number)', parse: fee => Number(fee), default: 0 }),
  extended: flags.boolean({ char: 'x', description: 'show extra columns (for table)', hidden: true }),
  csv: flags.boolean({description: 'output is csv format'}),
}
module.exports = { BaseFn, BaseFlags };