const gulp = require('gulp');
const fs = require('fs');
const glob = require('glob');
const farmhash = require('farmhash');

const globs = [
  'wwwroot/css/**/*.*',
  'wwwroot/js/**/*.*'
];

/**
 * @description Returns a path for each file in the specified globs.
 * @returns {string[]}
 */
function getFilePathsFromGlobs() {
  let paths = [];
  for (let i = 0; i < globs.length; i++) {
    const thisGlob = globs[i];
    paths = paths.concat(glob.sync(thisGlob, {nodir: true}));
  }
  return paths;
}

/**
 * @description Asynchronously generates content-based hashes for each file in the specified path array.
 * @param {string[]} filePaths
 * @returns {Promise}
 */
function generateAssetHashesJson(filePaths) {
  const promise = new Promise((resolve, reject) => {
    try {
      const hashesJsonPath = 'asset-hashes.json';
      let hashesJson = {};
      const promises = [];
      for (let i = 0; i < filePaths.length; i++) {
        const promise = new Promise(function (resolve2, reject2) {
          try {
            const filePath = filePaths[i];
            const fileData = fs.readFileSync(filePath);
            const fileHash = farmhash.fingerprint64(fileData);
            // the property name is the file path, the value is the hash
            hashesJson[filePath] = fileHash;
            resolve2();
          } catch (e) {
            reject2(e);
          }
        });
        promises.push(promise);
      }

      Promise.all(promises)
        .then(() => {
          const hashesJsonString = JSON.stringify(hashesJson, null, 2);
          console.log(`${hashesJsonPath}: ${hashesJsonString}`);
          fs.writeFile(hashesJsonPath, hashesJsonString, err => {
            if (err) reject(e);
            resolve()
          })
        })
        .catch(e => reject(e));
        
    } catch (e) {
      reject(e);
    }
  });
  return promise;
}

gulp.task('generateAssetHashes', () => {
  const paths = getFilePathsFromGlobs();
  return generateAssetHashesJson(paths);
})