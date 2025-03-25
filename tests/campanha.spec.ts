import { test, beforeAll, afterAll, expect } from 'vitest';
import { app } from '../src/app';
import request from 'supertest';
import moment from 'moment';
import { Campanha } from '../src/infra/domain/entities/campanha';

beforeAll(async () => {
    await app.ready()
})

test("O usuario consegue conse criar uma nova campanha", async () => {
    await request(app.server)
    .post('/campanha')
    .send({
        "nome": "campanha teste",
        "dataInicio": moment(). subtract(1, 'days'). toDate(),
        "dataFim": moment(). toDate(),
        "categoria": "Liberdade"
    }).expect(201)
})

test("Ao criar uma campanha a data fim deve ser sempre maior que a dataInicio.", async () => {
    await request(app.server)
    .post('/campanha')
    .send({
        "nome": "campanha teste",
        "dataInicio": moment(). toDate(),
        "dataFim": moment(). subtract(1, 'days'). toDate(),
        "categoria": "Liberdade"
    }).expect(400)
})

test("Ao criar uma campanha a data de início deve ser igual ou posterior à data atual no momento da criação.", async () => {
    await request(app.server)
    .post('/campanha')
    .send({
        "nome": "campanha teste",
        "dataInicio": moment().add(1, 'days'). toDate(),
        "dataFim": moment().add(2, 'days'). toDate(),
        "categoria": "Liberdade"
    }).expect(400)
})

test("Ao criar uma campanha a data de início deve ser igual ou posterior à data atual no momento da criação.", async () => {
    await request(app.server)
    .post('/campanha')
    .send({
        "nome": "campanha teste",
        "dataInicio": moment().add(1, 'days'). toDate(),
        "dataFim": moment().add(2, 'days'). toDate(),
        "categoria": "Liberdade"
    }).expect(400)
})

test("Ao criar uma campanha Se a data final for inferior à data atual, a campanha deve ser marcada como expirada", async () => {
    const response = await request(app.server)
    .post('/campanha')
    .send({
        "nome": "campanha teste",
        "dataInicio": moment().subtract(10, 'days'). toDate(),
        "dataFim": moment().subtract(1, 'days'). toDate(),
        "categoria": "Liberdade"
    });

    const id = response.body["id"];
    const responseGet  = await request(app.server)
    .get('/campanha');
    const campanhas : Campanha[] = responseGet.body;
    const campanha = campanhas.find(c => c.id == id);

    expect(campanha?.status).toBe('expirada')
})


test("Deve ser possivel deletar campanha", async () => {
    const response = await request(app.server)
    .post('/campanha')
    .send({
        "nome": "campanha teste",
        "dataInicio": moment().subtract(10, 'days'). toDate(),
        "dataFim": moment().subtract(1, 'days'). toDate(),
        "categoria": "Liberdade"
    });

    const id = response.body["id"];
    await request(app.server)
    .del(`/campanha/${id}`).expect(200);

    const responseGet  = await request(app.server)
    .get('/campanha');
    const campanhas : Campanha[] = responseGet.body;
    const campanha = campanhas.find(c => c.id == id);

    expect(campanha).toBeUndefined()
})

test("Deve ser possivel modificar campanha", async () => {
    const response = await request(app.server)
    .post('/campanha')
    .send({
        "nome": "campanha teste",
        "dataInicio": moment().subtract(10, 'days'). toDate(),
        "dataFim": moment().subtract(1, 'days'). toDate(),
        "categoria": "Liberdade"
    });

    const status = "pausada";
    const id = response.body["id"];
    await request(app.server)
    .put(`/campanha/${id}`).send({status})
    .expect(200);

    const responseGet  = await request(app.server)
    .get('/campanha');
    const campanhas : Campanha[] = responseGet.body;
    const campanha = campanhas.find(c => c.id == id);

    expect(campanha?.status).toBe(status);
})

afterAll(async () => {
    await app.close()
})