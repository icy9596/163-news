import originJSONP from 'jsonp';

function jsonp (url, data, opts) {
    return new Promise((resolve, reject) => {
        url = normalizeUrl(url, data);
        originJSONP(url, opts, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

export default jsonp;

function normalizeUrl (url, data) {
    let params = '';

    for (let key in data) {
        let keyVal = `&${key}=${data[key]}`;
        params += keyVal;
    }

    return url + params.substr(1);
}
