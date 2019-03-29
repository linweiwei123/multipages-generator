const oss = require('ali-oss');
const fs = require('fs');
const co = require('co');

function upload (config, file, filename) {

  let defaultConfig = {
  };

  if (fs.existsSync(aliossaccess)) {
    const access = JSON.parse(fs.readFileSync(aliossaccess, 'utf-8'));

    defaultConfig = Object.assign(defaultConfig, access);
  }

  const ossPath = `${config.prefix}/${filename}`;
  const store = oss(Object.assign(defaultConfig, config));

  return new Promise((resovle, reject) => {
    co(function* () {
      return yield store.list({
        prefix: ossPath,
      });
    }).then(data => {
      if (config.deduplication !== true || (config.deduplication === true && typeof data.objects === 'undefined')) {
        co(function* () {
          return yield store.put(ossPath, file);
        })
          .then(res => {
            resovle(res);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        reject(new Error('文件已存在'));
      }
    });
  });

}

module.exports = upload;
