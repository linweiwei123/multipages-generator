
const chalk = require('chalk');

module.exports = {
  runCallback(err, stats) {

    if (err) {
      console.error(chalk.red(err.stack || err));
      if (err.details) {
        console.error(chalk.red(err.details));
      }
      return false;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(chalk.red(info.errors));
    }

    if (stats.hasWarnings()) {
      console.warn(chalk.yellow(info.warnings));
    }

    return true;
  }
};
