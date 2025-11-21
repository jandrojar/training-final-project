import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

// Initialize the application
const app = new Koa();

app.use(cors({
  origin: 'http://localhost:8081', // * to allow all origins
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE',],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Middleware for parsing request bodies
app.use(bodyParser());

// Middleware for logging requests 
app.use(async (ctx, next) => {
	console.log(`Request received from path: ${ctx.path}, method: ${ctx.method}`);
	await next();
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
	console.log(`Server is running on port ${PORT}`) )