'use strict';

const usdocker = require('usdocker');
const fs = require('fs');
const fsutil = usdocker.fsutil();

const SCRIPTNAME = 'wordpress';

let config = usdocker.config(SCRIPTNAME);
let configGlobal = usdocker.configGlobal();
const CONTAINERNAME = SCRIPTNAME + configGlobal.get('container-suffix');

function getContainerDef() {

    let docker = usdocker.dockerRunWrapper(configGlobal);
    return docker
        .containerName(CONTAINERNAME)
        .port(config.get('port'), 80)
        .volume(config.get('folder'), '/data')
        .volume(config.get('pluginFolder'), '/var/www/html/wp-content/plugins')
        .volume(config.get('themesFolder'), '/var/www/html/wp-content/themes')
        .volume(config.get('uploadsFolder'), '/var/www/html/wp-content/uploads')
        .volume(config.get('languagesFolder'), '/var/www/html/wp-content/languages')
        .volume(config.getUserDir('conf'), '/usr/local/etc/php/conf.d/uploads.ini')
        .env('WORDPRESS_DB_HOST', config.get('db'))
        .env('WORDPRESS_DB_USER', config.get('dbUser'))
        .env('WORDPRESS_DB_PASSWORD', config.get('dbPassword'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', 'wordpress:4.8-php7.1');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('pluginFolder', config.getDataDir() + '/plugins');
        config.setEmpty('themesFolder', config.getDataDir() + '/themes');
        config.setEmpty('uploadsFolder', config.getDataDir() + '/uploads');
        config.setEmpty('languagesFolder', config.getDataDir() + '/languages');
        config.setEmpty('port', 8080);
        config.setEmpty('db', 'mysql' + configGlobal.get('container-suffix'));
        config.setEmpty('dbUser', 'root');
        config.setEmpty('dbPassword', 'password');

        config.copyToUserDir(__dirname + '/wordpress/conf');

        let folderList = [
            config.get('folder'),
            config.get('pluginFolder'),
            config.get('themesFolder'),
            config.get('uploadsFolder'),
            config.get('languagesFolder')
        ];

        for (let i=0; i<folderList.length; i++) {
            if (!fs.existsSync(folderList[i])) {
                fsutil.makeDirectory(folderList[i]);
            }
        }
        callback(null, 'setup loaded for ' + SCRIPTNAME);
    },

    debugcli(callback) {
        let result = usdocker.outputRaw('cli', getContainerDef());
        callback(result);
    },

    debugapi(callback) {
        let result = usdocker.outputRaw('api', getContainerDef());
        callback(result);
    },

    up: function(callback)
    {
        usdocker.up(CONTAINERNAME, getContainerDef(), callback);
    },

    status: function(callback) {
        usdocker.status(CONTAINERNAME, callback);
    },

    down: function(callback)
    {
        usdocker.down(CONTAINERNAME, callback);
    },

    restart: function(callback)
    {
        usdocker.restart(CONTAINERNAME, getContainerDef(), callback);
    }
};
