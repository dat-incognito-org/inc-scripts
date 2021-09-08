const { Command, flags } = require('@oclif/command')
const Inc = require('../external/inc');
const { SimpleWallet, init } = Inc;
const fs = require('fs-extra');
const { cli } = require('cli-ux');

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
    const nodeEndpoint = flags.endpoint || 'https://mainnet.incognito.org/fullnode';
    Object.assign(this, { readCsv, submitKey, truncateStr, showTx })
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
  extended: flags.boolean({ char: 'x', description: 'show extra columns (for table)', hidden: true }),
  csv: flags.boolean({description: 'output is csv format'}),
}
module.exports = { BaseFn, BaseFlags };