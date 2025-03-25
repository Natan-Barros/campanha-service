import db from "../database";
import { Campanha } from "../domain/entities/campanha";

export class CampanhaRepository {
    async create(campanha: Campanha): Promise<void> {
        await db("campanhas").insert<Campanha>(campanha);
    }

    async getAll(): Promise<Campanha[]> {
        return await db("campanhas").select<Campanha[]>();
    }

    async delete(id: string): Promise<void> {
        await db("campanhas").delete().where({ id });
    }

    async update(id: string,
        nome: string | undefined,
        dataInicio: Date | undefined,
        dataFim: Date | undefined,
        categoria: string | undefined,
        status: 'pausada' | undefined): Promise<void> {

        const campanhaExistenteData = await db("campanhas").where({ id }).first<Campanha>();

        if (!campanhaExistenteData) {
            throw new Error("Campanha não encontrada.");
        }

        const campanhaExistente = new Campanha(
            campanhaExistenteData.id,
            campanhaExistenteData.nome,
            new Date(campanhaExistenteData.dataInicio),
            new Date(campanhaExistenteData.dataFim),
            campanhaExistenteData.categoria
        );

        campanhaExistente.update(id, nome, dataInicio, dataFim, categoria, status);

        await db("campanhas")
            .where({ id: campanhaExistente.id })
            .update({
                nome: campanhaExistente.nome,
                dataInicio: campanhaExistente.dataInicio,
                dataFim: campanhaExistente.dataFim,
                status: campanhaExistente.status,
                categoria: campanhaExistente.categoria
            });
    }
}