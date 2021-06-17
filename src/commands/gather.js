const { BaseFn, BaseFlags } = require('../base');
const { Command, flags } = require('@oclif/command')
const fs = require('fs-extra');
const bn = require('bn.js');

class GatherCommand extends Command {
  async run() {
    const { flags } = this.parse(GatherCommand);
    await this.initIncognitoEnv(flags).catch(this.err);
    let tokenID = flags.token || this.Inc.constants.PRVIDSTR;
    const data = await this.readCsv(flags.file || 'gather.csv');
    const privateKeys = data.map(item => item.FromAddress);
    // get only one receiver address from the sheet
    const to = data.map(item => item.ToAddress)
      .filter(item => item && item.length > 10)[0];
    const fee = flags.fee || 100;

    privateKeys.forEach(async privateKey => {
      const sender = await this.inc.NewTransactor(privateKey).catch(this.err);
      await this.submitKey(sender, [tokenID], flags.reset).catch(this.err);
      // get unspent coins
      const coinList = await sender.coin(tokenID).catch(this.err);
      let amountList = coinList.map(c => c.Value);
      amountList.sort((a, b) => {
        a = new bn(a);
        b = new bn(b);
        return a.cmp(b);
      });
      const maxInputs = 30;
      for (let batch = amountList.splice(0, maxInputs); batch.length > 0; batch = amountList.splice(0, maxInputs)) {
        // keep sending a sum equal to my biggest MAX_INPUTS unspent coins
        let amountToSend = batch.reduce((total, v) => total.add(new bn(v)), new bn(0))
        let tx;
        if (tokenID == this.Inc.constants.PRVIDSTR) {
          amountToSend = amountToSend.subn(fee);
          const paymentInfos = [new this.Inc.types.PaymentInfo(to, amountToSend.toString())];
          tx = await sender.prv({ transfer: { fee, prvPayments: paymentInfos } }).catch(this.err);
          await sender.waitTx(tx.Response.txId, 3);
          this.showTx(tx, flags);
        } else {
          const paymentInfos = [new this.Inc.types.PaymentInfo(to, amountToSend)];
          tx = await sender.token({ transfer: { fee, tokenPayments: paymentInfos, tokenID: tokenID } }).catch(this.err);
          await sender.waitTx(tx.Response.txId, 3);
          this.showTx(tx, flags);
        }
      }
    })
  }

  static flags = {
    ...BaseFlags,
    file: flags.string({ char: 'f', description: 'File name for data' }),
    token: flags.string({ char: 't', description: 'Token ID (default: <PRVID>)' }),
  }
  static description = `Send all PRV or token from multiple owned accounts to one
    ...
    sender keys & payment infos are read from the input .csv sheet (--file)
  `
}
Object.assign(GatherCommand.prototype, BaseFn);

module.exports = GatherCommand