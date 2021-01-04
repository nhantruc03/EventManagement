var fs = require('fs');
var mime = require('mime');
const storeImage = (base64string) => {
    try {
        let matches = base64string.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            console.log('Invalid image');
        }
        response.type = matches[1];
        response.data = Buffer.from(matches[2], 'base64');
        let decodeImg = response;
        let imageBuffer = decodeImg.data;
        let type = decodeImg.type;
        let extension = mime.extension(type);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filename = uniqueSuffix + '-image.' + extension;

        fs.writeFileSync("./images/" + filename, imageBuffer, 'utf8');
        return filename;
    }
    catch (e) {
        console.log(e);
    }
}
module.exports = { storeImage };