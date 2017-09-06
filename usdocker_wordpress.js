'use strict';

const usdocker = require('@usdocker/usdocker');
const fs = require('fs');
const fsutil = usdocker.fsutil();
const path = require('path');

const SCRIPTNAME = 'wordpress';

let config = usdocker.config(SCRIPTNAME);
let configGlobal = usdocker.configGlobal();
const CONTAINERNAME = SCRIPTNAME + configGlobal.get('container-suffix');

function getContainerDef() {

    let docker = usdocker.dockerRunWrapper(configGlobal);

    if (config.get('enableDebug') === 'true') {
        docker.env('WORDPRESS_DEBUG', 'true');
    }

    if (config.get('dbTablePrefix') !== '') {
        docker.env('WORDPRESS_TABLE_PREFIX', config.get('dbTablePrefix'));
    }

    return docker
        .containerName(CONTAINERNAME)
        .port(config.get('port'), 80)
        .volume(path.join(config.get('folder'), 'wp-content'), '/var/www/html/wp-content')
        .volume(path.join(config.getUserDir('conf'), 'uploads.ini'), '/usr/local/etc/php/conf.d/uploads.ini')
        .env('WORDPRESS_DB_HOST', config.get('db'))
        .env('WORDPRESS_DB_USER', config.get('dbUser'))
        .env('WORDPRESS_DB_PASSWORD', config.get('dbPassword'))
        .env('WORDPRESS_DB_NAME', config.get('dbName'))
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
        config.setEmpty('port', 8080);
        config.setEmpty('db', 'mysql' + configGlobal.get('container-suffix'));
        config.setEmpty('dbUser', 'root');
        config.setEmpty('dbPassword', 'password');
        config.setEmpty('dbName', 'wordpress');
        config.setEmpty('dbTablePrefix', '');
        config.setEmpty('enableDebug', 'false');

        config.copyToUserDir(path.join(__dirname, 'wordpress', 'conf'));

        let folderList = [
            config.get('folder'),
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
