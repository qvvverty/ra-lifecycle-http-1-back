const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

const notes = [
  {
    id: 1,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In rutrum in nisi convallis commodo.'
  },
  {
    id: 2,
    content: 'Cras vitae velit in tellus porttitor congue nec sit amet nulla.'
  },
  {
    id: 3,
    content: 'Proin eros arcu, lobortis vitae consequat nec, cursus sit amet nulla.'
  },
];
let nextId = 4;

const router = new Router();

router.get('/notes', async (ctx, next) => {
  ctx.response.body = notes;
});

router.post('/notes', async (ctx, next) => {
  notes.push({ ...ctx.request.body, id: nextId++ });
  ctx.response.status = 204;
});

router.delete('/notes/:id', async (ctx, next) => {
  const noteId = Number(ctx.params.id);
  const index = notes.findIndex(o => o.id === noteId);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));