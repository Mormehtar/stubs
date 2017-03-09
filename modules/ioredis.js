const sinon = require('sinon');
const Promise = require('bluebird');
const COMMANDS = require('redis-commands').list;

function buildCommands(obj, commands) {
  commands.forEach(command => {
    obj[command] = sinon.stub();
    obj[command].returns(Promise.resolve());
  });
}

function Connection(...args) {
  this.args = args;
  this.pipelines = [];
  buildCommands(this, COMMANDS);
  sinon.spy(this, 'pipeline');
}

module.exports = Connection;

Connection.prototype.pipeline = function () {
  const connection = new Connection();
  this.pipelines.push(connection);
  return connection;
};
