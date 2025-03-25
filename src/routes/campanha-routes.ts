import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Campanha } from '../infra/domain/entities/campanha';
import { CampanhaRepository } from '../infra/repositories/campanha-repository';

export async function campanhaRoutes(app: FastifyInstance) {
    const campanhaRepository = new CampanhaRepository();

    app.get('/', async () => {

        const campanhas = await campanhaRepository.getAll();

        return campanhas
    })

    app.post('/', async (request, response) => {
        const createCampanhaBody = z.object({
            nome: z.string(),
            dataInicio: z.string().datetime(),
            dataFim: z.string().datetime(),
            categoria: z.string()
        }).refine((data) => new Date(data.dataInicio) < new Date(data.dataFim), {
            message: "A data de início não pode ser maior ou igual à data de fim",
            path: ["dataInicio"]
        }).refine((data) => new Date(data.dataInicio) <= new Date(), {
            message: "A data de início não pode ser maior que a data atual",
            path: ["dataInicio"]
        });

        try {
            const body = createCampanhaBody.parse(request.body);
            const id = crypto.randomUUID();
            const campanha = new Campanha(id, body.nome, new Date(body.dataInicio), new Date(body.dataFim), body.categoria)

            await campanhaRepository.create(campanha);

            return response.status(201).send({id});
        } catch (error) {
            if (error instanceof z.ZodError) {
                return response.status(400).send({
                    statusCode: 400,
                    error: "Bad Request",
                    message: error.errors.map((err) => err.message).join(", "),
                });
            }

            return response.status(500).send({
                statusCode: 500,
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Erro inesperado",
            });
        }
    })

    app.delete('/:id', async (request, response) => {
        const createCampanhaRoute = z.object({
            id: z.string(),
        });
        const id = request.params as string;

        const campanha = createCampanhaRoute.parse(id);

        await campanhaRepository.delete(campanha.id);

        return response.status(200).send();
    })

    app.put('/:id', async (request, response) => {
        const updateCampanhaBody = z.object({
            nome: z.string().optional(),
            dataInicio: z.string().datetime().optional(),
            dataFim: z.string().datetime().optional(),
            categoria: z.string().optional(),
            status: z.enum(['pausada']).optional()
        });

        const { id } = z.object({
            id: z.string(),
        }).parse(request.params);

        try {
            const body = updateCampanhaBody.parse(request.body);

            const campanhaExistente = await campanhaRepository.getAll().then(campanhas => campanhas.find(campanha => campanha.id === id));

            if (!campanhaExistente) {
                return response.status(404).send({ message: "Campanha não encontrada." });
            }

            await campanhaRepository.update(campanhaExistente.id,
                body.nome,
                body.dataInicio == undefined ? undefined : new Date(body.dataInicio),
                body.dataFim == undefined ? undefined : new Date(body.dataFim), body.categoria, body.status);

            return response.status(200).send();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return response.status(400).send({
                    statusCode: 400,
                    error: "Bad Request",
                    message: error.errors.map((err) => err.message).join(", "),
                });
            }

            return response.status(500).send({
                statusCode: 500,
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Erro inesperado",
            });
        }
    });
}