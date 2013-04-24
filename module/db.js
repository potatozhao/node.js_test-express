/**
 * Created with JetBrains WebStorm.
 * User: potatozhao
 * Date: 13-4-21
 * Time: 下午8:00
 * To change this template use File | Settings | File Templates.
 */

var setting = require('../settings.js');
var Db = require('mongodb').Db;
var Connection =  require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(setting.db,new Server(setting.host,Connection.DEFAULT_PORT,{}));