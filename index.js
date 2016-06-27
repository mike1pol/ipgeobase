"use strict"

const iconv = require('iconv-lite');
const http = require('http');
const parser = require('xml2json');

class IpGeoBase {
    constructor(codePage) {
        this.codePage = codePage || 'utf-8';
    }

    parseXML(data) {
        return parser.toJson(data, {
            object: true,
            reversible: false,
            coerce: false,
            sanitize: true,
            trim: true,
            arrayNotation: false
        })['ip-answer']['ip'];
    }

    getInfo(ip, codePage) {
        this.ip = ip;
        codePage = codePage || this.codePage;
        return this.getData(codePage).then(data => this.parseXML(data));
    }

    getData(codePage) {
        return new Promise((resolve, reject) => {
            const options = {
                host: 'ipgeobase.ru',
                port: 7020,
                path: `/geo?ip=${this.ip}`
            };
            http.request(options, res => {
                let str = '';
                if (codePage !== 'windows-1251') {
                    const stream = iconv.decodeStream('windows-1251');
                    res.pipe(stream);
                    stream.on('data', chunk => str += chunk);
                    stream.on('end', () => resolve(str));
                } else {
                    res.on('data', chunk => str += chunk);
                    res.on('end', () => resolve(str));
                }
            }).end();
        });
    }
}

module.export = IpGeoBase;
