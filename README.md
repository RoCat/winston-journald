# winston

A InfluxDB transport for [winston][0].

## Motivation
`tldr;?`: To break the [winston][0] codebase into small modules that work
together.

The [winston][0] codebase has been growing significantly with contributions and
other logging transports. This is **awesome**. However, taking a ton of
additional dependencies just to do something simple like logging to the Console
and a File is overkill.  

## Usage
``` js
  var winston = require('winston');
  
  /**
   * Requiring `winston-influxdb` will expose
   * `winston.transports.InfluxDB`
   */
  require('winston-influxdb').InfluxDB;
  
  winston.add(winston.transports.InfluxDB, options);
```

Caution: InfluxDB purpose is not properly to store logs but values and tags, then, with default configuration, message
is not used by this transport. only meta.tags and meta.values are used.

You can change InfluxDB transport comportment by providing buildValues and buildTags options at transport startup.

The InfluxDB transport takes the following options. 'db' is required:

* __level:__ Level of messages that this transport should log, defaults to
'info'.
* __db:__ InfluxDB database name.
* __hosts:__ InfluxDB hosts array default: [{ host: 'localhost', port: 8086, protocol: 'http' }]
* __measurement__: The name of the measurement you want to store log messages in,
defaults to 'log'.
* __username:__ The username to use when logging into InfluxDB.
* __password:__ The password to use when logging into InfluxDB. If you don't
supply a username and password it will not use InfluxDB authentication.
* __name:__ Transport instance identifier. Useful if you need to create multiple
InfluxDB transports.
* __buildValues:__ a function (level, message, meta, callback) used to build values objects, default function use
meta.values
* __buildTags:__ a function (level, message, meta, callback) used to build tags objects, default function use
meta.tags


## Installation

``` bash
  $ npm install winston
  $ npm install winston-influxdb
```

#### Author: [Romain CATOIO](http://rocat.fr)

[0]: https://github.com/flatiron/winston
