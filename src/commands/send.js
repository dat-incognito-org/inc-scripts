const { BaseFn, BaseFlags } = require('../base');
const { Command, flags } = require('@oclif/command')
const fs = require('fs-extra');

class SendCommand extends Command {
  async run() {
    const { flags } = this.parse(SendCommand);
    await this.initIncognitoEnv(flags).catch(this.err);
    let tokenID = flags.token || this.Inc.constants.PRVIDSTR;
    let paymentInfoList = this.readCsv(flags.file || 'send.csv');
    let sender = await this.inc.NewTransactor(flags.privateKey).catch(this.err);
    await this.submitKey(sender, [tokenID], flags.reset).catch(this.err);

    const maxReceivers = 20;
    for (let batch = paymentInfoList.splice(0, maxReceivers); batch.length > 0; batch = paymentInfoList.splice(0, maxReceivers)) {
      const paymentInfos = batch.map(pi => new this.Inc.types.PaymentInfo(pi.PaymentAddress, pi.Amount));
      let tx;
      if (tokenID == this.Inc.constants.PRVIDSTR) {
        tx = await sender.prv({ transfer: { fee: flags.fee || 100, prvPayments: paymentInfos }}).catch(this.err);
        await sender.waitTx(tx.Response.txId, 3);
        this.showTx(tx, flags);
      } else {
        tx = await sender.token({ transfer: { fee: flags.fee || 100, tokenPayments: paymentInfos, tokenID: tokenID }}).catch(this.err);
        await sender.waitTx(tx.Response.txId, 3);
        this.showTx(tx, flags);
      }
      console.log(paymentInfoList.length > 0 ? `${paymentInfoList.length} more payments to make`: 'Done.');
    }
  }

  static flags = {
    ...BaseFlags,
    file: flags.string({ char: 'f', description: 'File name for data' }),
    token: flags.string({ char: 't', description: 'Token ID (default: <PRVID>)' }),
    privateKey: flags.string({ char: 'p', description: 'Private Key to sign TX (default: PRIVATE_KEY environment variable)', env: 'PRIVATE_KEY' })
  }
  static description = `Send PRV or token to a list of receivers
    ...
    payment infos are read from the input .csv sheet (--file)
  `
}
Object.assign(SendCommand.prototype, BaseFn);

module.exports = SendCommand