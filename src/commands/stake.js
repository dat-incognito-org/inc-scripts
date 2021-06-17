const { BaseFn, BaseFlags } = require('../base');
const { Command, flags } = require('@oclif/command')
const fs = require('fs-extra');

class StakeCommand extends Command {
  async run() {
    const { flags } = this.parse(StakeCommand);
    await this.initIncognitoEnv(flags).catch(this.err);
    const tokenID = this.Inc.constants.PRVIDSTR;
    const data = await this.readCsv(flags.file || 'stake.csv');
    const privateKeys = data.map(item => item.PrivateKey);

    privateKeys.forEach(async privateKey => {
      const sender = await this.inc.NewTransactor(privateKey).catch(this.err);
      const myAddress = sender.key.base58CheckSerialize(this.Inc.constants.PaymentAddressType);
      await this.submitKey(sender, [tokenID], flags.reset).catch(this.err);
      let tx = await sender.stake({
        transfer: { fee: flags.fee || 100 },
        extra: { candidatePaymentAddress: myAddress, candidateMiningSeedKey: this.Inc.utils.base58CheckEncode(sender.key.getMiningSeedKey(), this.Inc.constants.ENCODE_VERSION), rewardReceiverPaymentAddress: myAddress, autoReStaking: flags.restake, stakingType: flags.stakeBeacon ? 1 : 0 }
      }).catch(this.err);
      await sender.waitTx(tx.Response.txId, 3);
      this.showTx(tx, flags);
    })
  }

  static flags = {
    ...BaseFlags,
    file: flags.string({ char: 'f', description: 'File name for data' }),
    stakeBeacon: flags.boolean({ description: 'WIP - activate when staking in beacon chain, as opposed to shard chain (default: false)', default: false, allowNo: true }),
    restake: flags.boolean({ description: 'Auto-restaking toggle (default: true)', default: true, allowNo: true }),
  }
  static description = `Send staking transactions using a list of sender private keys
    ...
    keys are read from the input .csv sheet (--file)
  `
}
Object.assign(StakeCommand.prototype, BaseFn);

module.exports = StakeCommand