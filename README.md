# parse-reply

Parse email replies with quotes and such.  This is a trivial javascript library that parses email body and strips out quotes/replies/forwarded messages.

## Usage

```javascripot
   var parseReply = require('parse-reply');
   ...
   var cleanedUpBody = parseReply(originalBody);
   // now cleanedUpBody does not from: and other quoted lines
```

## Issues

This uses a template of regular expressions and so it is not exhaustive.  If you find emails for which it does not work, please report the issue by providing the sample email for which it does not work well.
   
