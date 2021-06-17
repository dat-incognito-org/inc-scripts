const { BaseFn, BaseFlags } = require('../base');
const { Command, flags } = require('@oclif/command')
const fs = require('fs-extra');
const { cli } = require('cli-ux');

class BalanceCommand extends Command {
  async run() {
    const { flags } = this.parse(BalanceCommand);
    await this.initIncognitoEnv(flags).catch(this.err);
    let tokenID = flags.token || this.Inc.constants.PRVIDSTR;
    const data = await this.readCsv(flags.file || 'balance.csv');
    const privateKeys = data.map(item => item.PrivateKey);
    let result = [];
    for (let i = 0; i < privateKeys.length; i++) {
      let accountFunder = await this.inc.NewTransactor(privateKeys[i]).catch(this.err);
      await this.submitKey(accountFunder, [tokenID], flags.reset).catch(this.err);
      let bal = await accountFunder.getBalance(tokenID).catch(this.err);
      result.push({ id: i, key: privateKeys[i], balance: bal });
    }
    console.log(`Balances for token ${tokenID}\n`);
    // keys are truncated
    cli.table(result, { id: { minWidth: 7 }, key: { minWidth: 28, get: row =>
      this.truncateStr(row.key, flags)
    }, balance: {}}, flags)
  }

  static flags = {
    ...BaseFlags,
    file: flags.string({ char: 'f', description: 'File name for data' }),
    token: flags.string({ char: 't', description: 'Token ID (default: <PRVID>)' }),
  }
  static description = `Display balances for a list of private keys
    ...
    keys are read from the input .csv sheet (--file)
  `
}
Object.assign(BalanceCommand.prototype, BaseFn);

module.exports = BalanceCommand