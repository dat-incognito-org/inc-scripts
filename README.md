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
$ npm install -g .
$ incognitochain-scripts COMMAND
running command...
$ incognitochain-scripts (-v|--version|version)
scripts/1.0.0 linux-x64 node-v16.1.0
$ incognitochain-scripts --help [COMMAND]
USAGE
  $ incognitochain-scripts COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`incognitochain-scripts balance`](#incognitochain-scripts-balance)
* [`incognitochain-scripts help [COMMAND]`](#incognitochain-scripts-help-command)
* [`incognitochain-scripts send`](#incognitochain-scripts-send)

## `incognitochain-scripts balance`

Display balances for a list of private keys

```
USAGE
  $ incognitochain-scripts balance

OPTIONS
  -e, --endpoint=endpoint  node ip:port to connect to
  -f, --file=file          File name for data
  -r, --reset              activate to re-sync UTXOs (default: false)
  -t, --token=token        Token ID (default: <PRVID>)

DESCRIPTION
  ...
       keys are read from the input .csv sheet (--file)
```

_See code: [src/commands/balance.ts](https://github.com/incognitochain/incognito-chain-web-js/blob/v1.0.0/src/commands/balance.ts)_

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
  -t, --token=token            Token ID (default: <PRVID>)

DESCRIPTION
  ...
       payment infos are read from the input .csv sheet (--file)
```

_See code: [src/commands/send.ts](https://github.com/incognitochain/incognito-chain-web-js/blob/v1.0.0/src/commands/send.ts)_
<!-- commandsstop -->
