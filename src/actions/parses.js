var _byteToHex = [];

var _hexToByte = {};

for (var i = 0; i < 256; i++) {

    _byteToHex[i] = (i + 0x100).toString(16).substr(1);

    _hexToByte[_byteToHex[i]] = i;

}
 const parse = (s, buf, offset) => {

    var i = (buf && offset) || 0;
    var ii = 0;
    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function (oct) {

        if (ii < 16) { // Don't overflow!
            buf[i + ii++] = _hexToByte[oct];
        }
    });
    while (ii < 16) {
        buf[i + ii++] = 0;

    }
    return buf;
}

exports.parses = parse;