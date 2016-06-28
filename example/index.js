'use strict';

const IpGeoBase = require('../index');
const geoBase = new IpGeoBase();

geoBase.getInfo('85.143.133.194')
    .then(ip => {
        console.log(ip);
    });

geoBase.getInfo('92.2.3.4')
    .then(ip => {
        console.log(ip);
    });

geoBase.getInfo('127.0.0.1')
    .then(ip => {
        console.log(ip);
    })
    .catch(err => console.error(err));
