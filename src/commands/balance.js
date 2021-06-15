const { BaseFn, BaseFlags } = require('../base');
const { Command, flags } = require('@oclif/command')
const fs = require('fs-extra');

class BalanceCommand extends Command {
  async run() {
    const { flags } = this.parse(BalanceCommand);
    await this.initIncognitoEnv(flags).catch(this.err);
    let tokenID = flags.token || this.Inc.constants.PRVIDSTR;
    const data = await this.readCsv(flags.file || 'getBalanceMultiUsers.csv');
    const privateKeys = data.map(item => item.PrivateKey);

    for (let i = 0; i < privateKeys.length; i++) {
      let accountFunder = await this.inc.NewTransactor(privateKeys[i]).catch(this.err);
      if (flags.reset) await accountFunder.submitKeyAndSync([tokenID]).catch(this.err); else accountFunder.isSubmitOtaKey = true;
      let response = await accountFunder.getBalance(tokenID).catch(this.err);
      console.log(`Key ${privateKeys[i]} => Balance : ${response.toString()}`);
    }
  }

  static flags = {
    ...BaseFlags,
    reset: flags.boolean({ char: 'r', description: 'activate to re-sync UTXOs (default: false)', default: false }),
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