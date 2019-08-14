var fs = require('fs');

var emojis = JSON.parse(fs.readFileSync("./mu-emojis.json", "utf8"));

var codepoints = {};
var shortnames = {}

Object.values(emojis).forEach(function (e) {

  const value = {
    n: e.name,
    ca: e.category,
    o: e.order,
    s: e.shortname,
    ss: e.shortname_alternates,
    d: e.diversity,
    ds: e.diversities,
    co: e.code_points.fully_qualified,
    k: e.keywords,
  };

  codepoints[e.code_points.fully_qualified] = value;

  shortnames[e.shortname] = value;
  if (e.shortname_alternates && e.shortname_alternates.length) e.shortname_alternates.forEach((n) => shortnames[n] = value);
  if (e.keywords && e.keywords.length) e.keywords.forEach((n) => shortnames[n] = value);

});

fs.writeFileSync("./mu-emojis-by-codepoints.json", JSON.stringify(codepoints, null, 2));
fs.writeFileSync("./mu-emojis-by-shortnames.json", JSON.stringify(shortnames, null, 2));

var availables = fs.readFileSync("./assets/javascripts/mu-emoji-availables.js", "utf8");
var replace = availables.replace(/window\.muEmojis\.object = (.*);/, `window.muEmojis.object = ${JSON.stringify(codepoints)};`);

fs.writeFileSync("./assets/javascripts/mu-emoji-availables.js", replace);
