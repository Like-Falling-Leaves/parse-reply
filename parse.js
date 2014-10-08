module.exports = parseReplyPlainText;

var emailRE = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
module.exports.emailRE = emailRE;

var froms = ['from', 'von', 'de'];
var on = ['on', 'am'];
var wrote = ['wrote', 'schrieb'];
var forwards = [
  'begin forwarded message',
  'forwarded message',
  'anfang der weitergeleiteten', 
  'original message',
  'ursprüngliche nachricht',
  'mensaje original'
];

var compiled = null;
function getCompiled() {
  if (compiled) return compiled;
  var patterns = [];

  // any line that starts with From: email
  froms.forEach(function (ff) { 
    patterns.push('^' + ff + ':.*' + emailRE + '.*$'); 
    patterns.push('^>\\s*' + ff + ':.*' + emailRE + '.*$');
  });

  // gmail style reply: date <email>
  patterns.push('^[0-9]{4}/[0-9]{1,2}/[0-9]{1,2} .* <\\s*' + emailRE + '\\s*>$')

  // some email clients just say email@domain.com wrote:
  patterns.push('^' + emailRE + '\\s+wrote:\\s+$');

  // others say On date X wrote:
  wrote.forEach(function (ww, index) {
    patterns.push('^' + on[index] + '[\\s\\S]*' + ww + '.*:$');
  });

  // forwarded emails are a bit messier
  patterns.push('^____+$');
  forwards.forEach(function (fwd) {
    patterns.push('^' + fwd.replace(' ', '\\s+') + ':$');
    patterns.push('^-+\\s+' + fwd.replace(' ', '\\s+') + '\\s+-+$');
  });
  compiled = new RegExp('(' + patterns.join('|') + ')', 'im');
  return compiled;
}

function parseReplyPlainText(text) {
  if (!text) return '';
  var re = getCompiled();
  var mm = text.match(re);
  if (mm && mm.index) return text.slice(0, mm.index);
  return text;
}
