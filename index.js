const http = require('http');
const createHandler = require('github-webhook-handler');
const config = require('./config');
const handler = createHandler(config);

http.createServer((req, res) => {
  handler(req, res, (error) => {
    res.statusCode = 404;
    res.end('no such location');
  })
}).listen(8001);

handler.once('error', console.log);

handler.on('push', ({ ref }) => {
  // TODO run test
  console.log('push ref: ', ref);
});

handler.on('pull_request', ({ action, pull_request }) => {
  const branch = pull_request.base.ref;
  console.log(action, branch);

  if (action === 'closed'
    && branch.test(/^dev|feature\/[\d+\.*]+$/i)
    && pull_request.base.merged
  ) {
    // TODO run build scripts
  }
});

handler.once('release', ({ action, release }) => {
  // TODO build
  console.log('release:', action, release);
});
