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

handler.on('pull_request', ({ payload }) => {
  const branch = payload.pull_request.base.ref;
  const action = payload.action;
  const merged = payload.pull_request.base.merged;

  console.log(branch, action, merged);

  if (action === 'closed'
    && branch.test(/^dev|feature\/[\d+\.*]+$/i)
    && merged
  ) {
    console.log('run bulid scripts');
    // TODO run build scripts
  }
});

handler.once('release', ({ action, release }) => {
  // TODO build
  console.log('release:', action, release);
});
