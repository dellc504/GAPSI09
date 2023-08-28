import { createSchema, createYoga } from 'graphql-yoga';
import { schema } from './model/schema';
import Koa from 'koa';
import * as Router from "koa-router";
import *  as cors from '@koa/cors';


export function buildApp() {
  const app = new Koa();
  const router =   new Router();


 

  const yoga = createYoga<Koa.ParameterizedContext>({
    schema: schema,
    cors: false,
    logging: false,
  });

 
  router.get('/test', (ctx, next) => {
    ctx.body = "{\"data\":\"VTKX\"}";
  });
 

router.post('/version', (ctx, next) => {
  ctx.body = "{\"data\":\"Version:  0.0.2\"}";
});

router.post('/msg', (ctx, next) => {
  ctx.body = "{\"data\":\"Bienvenido Candidato 01\"}";;
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

  app.use(async ctx => {
    const response = await yoga.handleNodeRequest(ctx.req, ctx);

    // Set status code
    ctx.status = response.status;

    // Set headers
    for (const [key, value] of response.headers.entries()) {
      ctx.append(key, value);
    }

    ctx.body = response.body;
  });

  
  return app;
}