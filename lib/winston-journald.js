/**
 * Winston Transport for outputting to the systemd journal.
 *
 * See http://www.freedesktop.org/software/systemd/man/systemd.journal-fields.html
 *
 * (C) 2012 Mark Theunissen
 * MIT (EXPAT) LICENCE
 *
 */

var util = require('util'),
  winston = require('winston'),
  Transport = require('winston').Transport,
  lodash = require('lodash'),
  journald = require('systemd-journald');

var levels =  [
  { journaldName: 'debug', winstonName: 'debug', level: 7 },
  { journaldName: 'info', winstonName: 'info', level: 6 },
  { journaldName: 'notice', winstonName: 'notice', level: 5 },
  { journaldName: 'warning', winstonName: 'warning', level: 4 },
  { journaldName: 'err', winstonName: 'error', level: 3 },
  { journaldName: 'crit', winstonName: 'crit', level: 2 },
  { journaldName: 'alert', winstonName: 'alert', level: 1 },
  { journaldName: 'emerg', winstonName: 'emerg', level: 0 }
];

/**
 * The module's exports.
 */
var Journald = exports.Journald = function (options) {
  if(options && !options.level){
    options.level = 'debug';
  }
  this.options = options || {level: 'debug'};
  Transport.call(this, this.options);
  this.name = 'journald';
};

/**
 * Inherit from `winston.Transport`.
 */
util.inherits(Journald, Transport);
winston.transports.Journald = Journald;


/**
 * Expose the name of this Transport on the prototype
 */
Journald.prototype.name = 'journald';

/**
 * Write to the log. The level is added to the log message, along with
 * the numerical priority, if there is a valid level-to-priority map entry.
 *
 * Any additional fields can be passed in the 'event_meta' parameter, which
 * are added to the message, overriding any fields defined as default_meta.
 */
Journald.prototype.log = function (level, msg, event_meta, callback) {
  var wantedLevel = lodash.find(levels, {winstonName: level});
  var minLevel = lodash.find(levels, {winstonName: this.level});
  if(wantedLevel && minLevel && wantedLevel.level <= minLevel.level) {
    if (typeof journald[wantedLevel.journaldName] === 'function') {
      if(typeof msg === 'object' && !(msg instanceof Error)){
        msg = JSON.stringify(msg);
      }
      if(event_meta && this.options.concatMetaToMessage) {
        msg = concatMetaToMessage(msg, event_meta);
      }
      journald[wantedLevel.journaldName](msg, event_meta, callback);
    } else {
      callback(wantedLevel.journaldName + ' is not a correct level name');
    }
  } else {
    return callback();
  }
};

function concatMetaToMessage(msg, event_meta) {
  if (typeof msg !== 'string') {
    return msg;
  }
  var event_meta_str = (typeof event_meta === 'object') ? JSON.stringify(event_meta) : event_meta;
  if (event_meta_str === '{}') {
    return msg;
  }
  return msg + ' --- metadata: ' + event_meta_str;
}
