const Koa = require('koa');

const port = process.env.KP_TEST_PORT;

const app = new Koa();
// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(port, err => {
  console.info(`listen on port ${port}`);
});
