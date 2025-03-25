import fastify from 'fastify';
import { campanhaRoutes } from './routes/campanha-routes';

export const app = fastify();

app.register(campanhaRoutes, {
    prefix: "campanha"
});