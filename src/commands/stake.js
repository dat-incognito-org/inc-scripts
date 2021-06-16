const { BaseFn, BaseFlags } = require('../base');
const { Command, flags } = require('@oclif/command')
const fs = require('fs-extra');

class StakeCommand extends Command {
  async run() {
    const { flags } = this.parse(StakeCommand);
    await this.initIncognitoEnv(flags).catch(this.err);
    const tokenID = this.Inc.constants.PRVIDSTR;
    const data = await this.readCsv(flags.file || 'getBalanceMultiUsers.csv');
    const privateKeys = data.map(item => item.PrivateKey);

    privateKeys.forEach(async privateKey => {
      const sender = await this.inc.NewTransactor(privateKey).catch(this.err);
      const myAddress = sender.key.base58CheckSerialize(this.Inc.constants.PaymentAddressType);
      await this.submitKey(sender, [tokenID], flags.reset).catch(this.err);
      const paymentInfos = batch.map(pi => new this.Inc.types.PaymentInfo(pi.PaymentAddress, pi.Amount));
      let tx = await sender.stake({
        transfer: { fee: flags.fee || 100 },
        extra: { candidatePaymentAddress: myAddress, candidateMiningSeedKey: this.Inc.utils.checkEncode(sender.getMiningSeedKey(), this.Inc.constants.ENCODE_VERSION), rewardReceiverPaymentAddress: myAddress, autoReStaking: flags.restake, stakingType: flags.stakeBeacon ? 1 : 0 }
      }).catch(this.err);
      await sender.waitTx(tx.Response.txId, 3);
      console.log('Sent new transaction', tx);
    })
  }

  static flags = {
    ...BaseFlags,
    file: flags.string({ char: 'f', description: 'File name for data' }),
    stakeBeacon: flags.string({ char: 'b', description: 'Activate when staking in beacon chain, as opposed to shard chain (default: false)', default: false }),
    restake: flags.boolean({ char: 'a', description: 'Auto-restaking toggle (default: true)', default: true }),
  }
  static description = `Send staking transactions using a list of sender private keys
    ...
    keys are read from the input .csv sheet (--file)
  `
}
Object.assign(StakeCommand.prototype, BaseFn);

module.exports = StakeCommand