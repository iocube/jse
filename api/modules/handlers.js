const config = require('../../config');
const installedModules = require('../../modules/package.json');


function listInstalledModules(request, response) {
    const whitelisted = config.modules;
    response.json({installed: installedModules.dependencies, whitelisted: whitelisted});
}

exports.listInstalledModules = listInstalledModules;
