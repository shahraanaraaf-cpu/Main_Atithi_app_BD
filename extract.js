const fs = require('fs');

const expData = fs.readFileSync('c:/Users/shahr/Code/Atithi_app_BD/Main_Atithi_app_BD/atithi-app-bd/modules/experiences/data/experienceData.ts', 'utf8');
const srvData = fs.readFileSync('c:/Users/shahr/Code/Atithi_app_BD/Main_Atithi_app_BD/atithi-app-bd/modules/services/data/serviceData.ts', 'utf8');

const titleRegex = /title:\s*'((?:[^'\\]|\\.)*)'/g;
const hostRegex = /hostType:\s*'((?:[^'\\]|\\.)*)'/g;
const providerRegex = /provider:\s*'((?:[^'\\]|\\.)*)'/g;

const getMatches = (data, regex) => [...new Set([...data.matchAll(regex)].map(m => m[1].replace(/\\'/g, "'")))];

const expTitles = getMatches(expData, titleRegex);
const expHosts = getMatches(expData, hostRegex);
const srvTitles = getMatches(srvData, titleRegex);
const srvProviders = getMatches(srvData, providerRegex);

fs.writeFileSync('expStrings.json', JSON.stringify({titles: expTitles, hosts: expHosts}, null, 2));
fs.writeFileSync('srvStrings.json', JSON.stringify({titles: srvTitles, providers: srvProviders}, null, 2));

console.log('Done');
