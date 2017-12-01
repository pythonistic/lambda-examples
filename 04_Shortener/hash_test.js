`use strict;`

var hashes = new Map();

fs = require('fs');
fs.readFile('/usr/share/dict/words', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    // split on whitespace
    var wordCount = 0;
    var entries = 0;
    for (const word of data.split(/[ \n]+/)) {
        wordCount++;
        h = hash(word);
        if (h in hashes) {
            console.log("Collision!");
            var ct = hashes.get(h);
            hashes.set(h, ct++);
        } else {
            entries++;
            hashes.set(h, 1);
        }
    }

    for (const h of hashes) {
        if (hashes.get(h) > 1) {
            console.log(h, hashes.get(h));
        }
    }
    console.log("Total hashes:", entries);
    console.log("Total words:", wordCount);

});

const TABLE = "ABCDEFGHJIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const TABLE_LEN = TABLE.length;

var hash = function(s) {
    // output
    var o = "";

    // salt the URL to prevent reversing/precomputing hashes
    s = Date.now() + s;

    // hash the URL
    var h = Math.abs(s.split("").reduce(function(a,b) {
        a = ((a<<5) - a) + b.charCodeAt(0);
        return a & a }, 0));

    // round up to an even number of bytes in the hash
    var hs = h.toString();
    if (hs.length % 2 != 0) {
        hs += "0";
    }

    // apply the hash against the table of character
    // discard most of the bytes, just use the mod
    for (var i = 0; i < hs.length; i += 2) {
        var b = hs[i] * 0xFF + hs[i + 1];
        o += TABLE[b % TABLE_LEN];
    }

    return o;
};
