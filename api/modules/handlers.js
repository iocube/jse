const moduleToAlias = require('../../config').moduleToAlias;
const modules = require('../../modules/package.json').dependencies;


function listInstalledModules(request, response) {
    let listOfModules = [];

    for (let name of modules) {
        listOfModules.push({
          name: name,
          alias: moduleToAlias[name] || undefined
        });
      }

    response.json(listOfModules);
}

exports.listInstalledModules = listInstalledModules;
