'use strict';

const iconv = require('iconv-lite');
const http = require('http');

class IpGeoBase {
    constructor(codePage) {
        this.codePage = codePage || 'utf-8';
    }

    parseXML(data) {
        const re = /<ip\svalue="(.+)"><inetnum>(.+)<\/inetnum><country>(.+)<\/country>(<city>(.+)<\/city><region>(.+)<\/region><district>(.+)<\/district><lat>(.+)<\/lat><lng>(.+)<\/lng><\/ip>|<\/ip>)/ig;
        const reE = /not\sfound/ig;
        const ip = {};
        data = data.replace(/<\?xml.+\n<ip-answer>\n(.+)\n<\/ip-answer>/, "$1");
        if (reE.test(data)) {
            throw {
                message: 'not found'
            }
        }
        data = re.exec(data);
        if (data && data.length > 0) {
            data.forEach((d, i) => {
                if (i === 1) {
                    ip.ip = d;
                } else if (i === 2) {
                    ip.inetnum = d;
                } else if (i === 3) {
                    ip.country = d;
                } else if (i === 5 && d) {
                    ip.city = d;
                } else if (i === 6 && d) {
                    ip.region = d;
                } else if (i === 7 && d) {
                    ip.district = d;
                } else if (i === 8 && d) {
                    ip.lat = d;
                } else if (i === 9 && d) {
                    ip.lng = d;
                }
            });
        }
        return ip;
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

module.exports = IpGeoBase;
