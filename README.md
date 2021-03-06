# holded-bot
[![NPM Version](https://img.shields.io/npm/v/holded-bot.svg)](https://www.npmjs.com/package/holded-bot) [![NPM Downloads](https://img.shields.io/npm/dm/holded-bot.svg)](https://www.npmjs.com/package/holded-bot)[![Travis](https://api.travis-ci.com/gabrielseco/holded-bot.svg?branch=master)](https://travis-ci.org/gabrielseco/holded-bot) [![Coverage Status](https://coveralls.io/repos/github/gabrielseco/holded-bot/badge.svg?branch=master)](https://coveralls.io/github/gabrielseco/holded-bot?branch=master)

 > A holded robot responsible to take hours for you


 ## Installation

 ```sh
 npm i -g holded-bot
 ``` 


 ### Requirements

 holded-bot requires 3 fields of info to start working for you

 * Company: Insert the name of your enterprise holded account, usually it's your company name
 * Email: Your email in holded
 * Password: Your password in holded

 This fields are saved in your Keychain in mac, in another platforms like linux or windows check the [keytar module](http://atom.github.io/node-keytar/)


 ### Use

It has two commands start and stop


#### Start

Start takes the actual time and inserts it in the day of the week.

```sh
  holded-bot start
```

#### Stop

Stop commands updates the time when you stop the task

```sh
  holded-bot stop
```

### Options

| Option | Alias | Description |
| --- | --- | --- |
| --debug | -d | Debug puppeteer so you what happens under the hood |
| --time | -t | Give a time in hh:mm format so you can put the time you want for a day |
