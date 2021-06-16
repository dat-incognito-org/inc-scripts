const { BaseFn, BaseFlags } = require('../base');
const { Command, flags } = require('@oclif/command')
const fs = require('fs-extra');

class ContributeCommand extends Command {
  async run() {
    const { flags } = this.parse(ContributeCommand);
    await this.initIncognitoEnv(flags).catch(this.err);
    let tokenID = flags.token || this.Inc.constants.PRVIDSTR;
    let sender = await this.inc.NewTransactor(flags.privateKey).catch(this.err);
    await this.submitKey(sender, [tokenID], flags.reset).catch(this.err);

    let tx = await sender.createAndSendTxWithContribution({
      transfer: { fee: flags.fee || 100, tokenID },
      extra: { pairID: flags.pairID, contributedAmount: flags.amount }
    }).catch(this.err);
    await sender.waitTx(tx.Response.txId, 3);
    console.log('Sent new transaction', tx);
  }

  static flags = {
    ...BaseFlags,
    token: flags.string({ char: 't', description: 'Token ID (default: <PRVID>)' }),
    privateKey: flags.string({ char: 'p', description: 'Private Key to sign TX (default: PRIVATE_KEY environment variable)', env: 'PRIVATE_KEY' }),
    pairID: flags.string({ char: 'i', description: 'Pair ID to contribute' }),
    amount: flags.string({ char: 'a', description: 'Amount to contribute' })
  }
  static description = `Contribute PRV or token to pDex
    ...
    check your pair ID carefully before creating TX
  `
}
Object.assign(ContributeCommand.prototype, BaseFn);

module.exports = ContributeCommand