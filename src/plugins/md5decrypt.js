var CryptoJS = require("crypto-js");
const md5_decrypt = (val) => {
    var bytes  = CryptoJS.AES.decrypt(val, process.env.VUE_APP_SECRET_KEY);

    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText
}


export default md5_decrypt;
