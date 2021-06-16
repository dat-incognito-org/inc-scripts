scripts
=======

Incognito Chain Dev Scripts

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/scripts.svg)](https://npmjs.org/package/scripts)
[![Downloads/week](https://img.shields.io/npm/dw/scripts.svg)](https://npmjs.org/package/scripts)
[![License](https://img.shields.io/npm/l/scripts.svg)](https://github.com/incognitochain/incognito-chain-web-js/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g scripts
$ incognitochain-scripts COMMAND
running command...
$ incognitochain-scripts (-v|--version|version)
scripts/1.0.0 linux-x64 node-v16.3.0
$ incognitochain-scripts --help [COMMAND]
USAGE
  $ incognitochain-scripts COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`incognitochain-scripts balance`](#incognitochain-scripts-balance)
* [`incognitochain-scripts contribute`](#incognitochain-scripts-contribute)
* [`incognitochain-scripts gather`](#incognitochain-scripts-gather)
* [`incognitochain-scripts help [COMMAND]`](#incognitochain-scripts-help-command)
* [`incognitochain-scripts send`](#incognitochain-scripts-send)
* [`incognitochain-scripts stake`](#incognitochain-scripts-stake)
* [`incognitochain-scripts withdraw-reward`](#incognitochain-scripts-withdraw-reward)

## `incognitochain-scripts balance`

Display balances for a list of private keys

```
USAGE
  $ incognitochain-scripts balance

OPTIONS
  -e, --endpoint=endpoint  node ip:port to connect to
  -f, --file=file          File name for data
  -r, --reset              activate to re-sync UTXOs for this token (default: false)
  -t, --token=token        Token ID (default: <PRVID>)
  --fee=fee                user-specified fee (must be number)

DESCRIPTION
  ...
       keys are read from the input .csv sheet (--file)
```

_See code: [src/commands/balance.ts](https://github.com/incognitochain/incognito-chain-web-js/blob/v1.0.0/src/commands/balance.ts)_

## `incognitochain-scripts contribute`

Contribute PRV or token to pDex

```
USAGE
  $ incognitochain-scripts contribute

OPTIONS
  -a, --amount=amount          Amount to contribute
  -e, --endpoint=endpoint      node ip:port to connect to
  -i, --pairID=pairID          Pair ID to contribute
  -p, --privateKey=privateKey  Private Key to sign TX (default: PRIVATE_KEY environment variable)
  -r, --reset                  activate to re-sync UTXOs for this token (default: false)
  -t, --token=token            Token ID (default: <PRVID>)
  --fee=fee                    user-specified fee (must be number)

DESCRIPTION
  ...
       check your pair ID carefully before creating TX
```

_See code: [src/commands/contribute.ts](https://github.com/incognitochain/incognito-chain-web-js/blob/v1.0.0/src/commands/contribute.ts)_

## `incognitochain-scripts gather`

Send all PRV or token from multiple owned accounts to one

```
USAGE
  $ incognitochain-scripts gather

OPTIONS
  -e, --endpoint=endpoint  node ip:port to connect to
  -f, --file=file          File name for data
  -r, --reset              activate to re-sync UTXOs for this token (default: false)
  -t, --token=token        Token ID (default: <PRVID>)
  --fee=fee                user-specified fee (must be number)

DESCRIPTION
  ...
       sender keys & payment infos are read from the input .csv sheet (--file)
```

_See code: [src/commands/gather.ts](https://github.com/incognitochain/incognito-chain-web-js/blob/v1.0.0/src/commands/gather.ts)_

## `incognitochain-scripts help [COMMAND]`

display help for incognitochain-scripts

```
USAGE
  $ incognitochain-scripts help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `incognitochain-scripts send`

Send PRV or token to a list of receivers

```
USAGE
  $ incognitochain-scripts send

OPTIONS
  -e, --endpoint=endpoint      node ip:port to connect to
  -f, --file=file              File name for data
  -p, --privateKey=privateKey  Private Key to sign TX (default: PRIVATE_KEY environment variable)
  -r, --reset                  activate to re-sync UTXOs for this token (default: false)
  -t, --token=token            Token ID (default: <PRVID>)
  --fee=fee                    user-specified fee (must be number)

DESCRIPTION
  ...
       payment infos are read from the input .csv sheet (--file)
```

_See code: [src/commands/send.ts](https://github.com/incognitochain/incognito-chain-web-js/blob/v1.0.0/src/commands/send.ts)_

## `incognitochain-scripts stake`

Send staking transactions using a list of sender private keys

```
USAGE
  $ incognitochain-scripts stake

OPTIONS
  -e, --endpoint=endpoint  node ip:port to connect to
  -f, --file=file          File name for data
  -r, --reset              activate to re-sync UTXOs for this token (default: false)
  --fee=fee                user-specified fee (must be number)
  --[no-]restake           Auto-restaking toggle (default: true)
  --[no-]stakeBeacon       WIP - activate when staking in beacon chain, as opposed to shard chain (default: false)

DESCRIPTION
  ...
       keys are read from the input .csv sheet (--file)
```

_See code: [src/commands/stake.ts](https://github.com/incognitochain/incognito-chain-web-js/blob/v1.0.0/src/commands/stake.ts)_

## `incognitochain-scripts withdraw-reward`

Withdraw the reward from your validator key list

```
USAGE
  $ incognitochain-scripts withdraw-reward

OPTIONS
  -e, --endpoint=endpoint  node ip:port to connect to
  -f, --file=file          File name for data
  -r, --reset              activate to re-sync UTXOs for this token (default: false)
  -t, --token=token        Token ID (default: <PRVID>)
  --fee=fee                user-specified fee (must be number)

DESCRIPTION
  ...
       private keys are read from the input .csv sheet (--file)
```

_See code: [src/commands/withdraw-reward.ts](https://github.com/incognitochain/incognito-chain-web-js/blob/v1.0.0/src/commands/withdraw-reward.ts)_
<!-- commandsstop -->
