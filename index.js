const http = require('http');
const createHandler = require('github-webhook-handler');
const shell = require('shelljs');
const config = require('./config');
const handler = createHandler(config);

http.createServer((req, res) => {
  handler(req, res, (error) => {
    res.statusCode = 404;
    res.end('no such location');
  })
}).listen(8001);

handler.once('error', console.log);

handler.on('push', ({ payload }) => {
  // TODO run test
  console.log('push ref: ', payload.ref);
});

handler.on('pull_request', ({ payload }) => {
  const branch = payload.pull_request.base.ref;
  const action = payload.action;
  const merged = payload.pull_request.merged;

  console.log(branch, action, merged);

  if (
    action === 'closed'
    && /^dev|feature\/[\d+\.*]+$/i.test(branch)
    && merged
  ) {
    console.log('run bulid scripts');
    shell.exec('sh ./scripts/management-build.sh');
  }
});

handler.on('release', ({ payload }) => {
  // TODO build
  console.log('release:', payload.action, payload.release);
});
