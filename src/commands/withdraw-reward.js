const { BaseFn, BaseFlags } = require('../base');
const { Command, flags } = require('@oclif/command')
const fs = require('fs-extra');
const bn = require('bn.js');


class WithdrawRewardCommand extends Command {
  async run() {
    const { flags } = this.parse(WithdrawRewardCommand);
    await this.initIncognitoEnv(flags).catch(this.err);
    let tokenID = flags.token || this.Inc.constants.PRVIDSTR;
    const data = await this.readCsv(flags.file || 'withdraw-reward.csv');
    const privateKeys = data.map(item => item.PrivateKey);
    const fee = flags.fee || 100;

    privateKeys.forEach(async privateKey => {
      const sender = await this.inc.NewTransactor(privateKey).catch(this.err);
      await this.submitKey(sender, [tokenID], flags.reset).catch(this.err);
      let reward = await sender.getRewardAmount(sender.key.base58CheckSerialize(this.Inc.constants.PaymentAddressType), false, tokenID).catch(this.err);
      reward = new bn(reward);

      if (reward.gtn(0)) {
        const tx = await sender.withdraw({ transfer: { fee, tokenID }}).catch(this.err);
        await sender.waitTx(tx.Response.txId, 3);
        console.log('Sent new transaction', tx);
      } else {
        console.log('No available reward for key', privateKey);
      }
    })
  }

  static flags = {
    ...BaseFlags,
    file: flags.string({ char: 'f', description: 'File name for data' }),
    token: flags.string({ char: 't', description: 'Token ID (default: <PRVID>)' }),
  }
  static description = `Withdraw the reward from your validator key list
    ...
    private keys are read from the input .csv sheet (--file)
  `
}
Object.assign(WithdrawRewardCommand.prototype, BaseFn);

module.exports = WithdrawRewardCommand