module.exports = parseReplyPlainText;

var emailRE = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
var simpleEmailRE = "\S+@\S+";
module.exports.emailRE = emailRE;
module.exports.simpleEmailRE = simpleEmailRE;

var froms = ['from'];
var on = ['on'];
var wrote = ['wrote'];
var forwards = [
  'forwarded message',
  'original message'
];

var compiled = null;
function getCompiled() {
  if (compiled) return compiled;
  var patterns = [];

  // any line that starts with From: email
  froms.forEach(function (ff) { 
    patterns.push('^' + ff + ':.*' + simpleEmailRE + '.*$'); 
    patterns.push('^>\\s*' + ff + ':.*' + simpleEmailRE + '.*$');
  });

  // gmail style reply: date <email>
  patterns.push('^[0-9]{4}/[0-9]{1,2}/[0-9]{1,2} .* <\\s*' + simpleEmailRE + '\\s*>$')

  // some email clients just say email@domain.com wrote:
  patterns.push('^' + simpleEmailRE + '\\s+wrote:\\s+$');

  // others say On date X wrote:
  wrote.forEach(function (ww, index) {
    patterns.push('^' + on[index] + '[\\s\\S]*' + ww + '.*:$');
  });

  // forwarded emails are a bit messier
  patterns.push('^____+$');
  forwards.forEach(function (fwd) {
    patterns.push('^.*' + fwd.replace(' ', '\\s+') + ':$');
    patterns.push('^-+\\s+' + fwd.replace(' ', '\\s+') + '\\s+-+$');
  });
  compiled = new RegExp('(' + patterns.join('|') + ')', 'im');
  return compiled;
}

function parseReplyPlainText(text) {
  if (!text) return '';
  var re = getCompiled();
  var mm = text.match(re);
  if (mm) return text.slice(0, mm.index);
  return text;
}
