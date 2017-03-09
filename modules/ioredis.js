const sinon = require('sinon');
const Promise = require('bluebird');

const COMMANDS = require('redis-commands').list;

function buildCommands(obj, commands) {
  commands.forEach(command => {
    obj[command] = sinon.stub();
    obj[command].returns(Promise.resolve());
  });
}

module.exports = function getConnection(isolated) {

  function Connection(...args) {
    this.args = args;
    this.pipelines = [];
    if (isolated) { buildCommands(this, COMMANDS); }
  }

  Connection.prototype.pipeline = function () {
    const connection = new Connection();
    this.pipelines.push(connection);
    return connection;
  };

  buildCommands(Connection.prototype, COMMANDS);

  return Connection;
};