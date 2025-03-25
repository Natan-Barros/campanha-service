export class Campanha {
    id: string;
    nome: string;
    dataInicio: Date;
    dataFim: Date;
    status: 'ativa' | 'pausada' | 'expirada';
    categoria: string;
    dataCadastro: Date;

    constructor(
        id: string,
        nome: string,
        dataInicio: Date,
        dataFim: Date,
        categoria: string,
    ) {
        this.id = id;
        this.nome = nome;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.categoria = categoria;
        this.dataCadastro = new Date();
        this.status = this.GetStatus();
    }

    update(id: string | undefined,
        nome: string | undefined,
        dataInicio: Date | undefined,
        dataFim: Date | undefined,
        categoria: string | undefined,
        status: 'pausada' | undefined
    ): void {

        this.id = id ?? this.id;
        this.nome = nome ?? this.nome;
        this.dataInicio = dataInicio ?? this.dataInicio;
        this.dataFim = dataFim ?? this.dataFim;
        this.categoria = categoria ?? this.categoria;
        this.status = status == undefined ? this.GetStatus() : status;

        if (this.dataInicio >= this.dataFim) {
            throw new Error("A data de início não pode ser maior ou igual à data de fim.");
        }

        if (this.dataInicio > new Date()) {
            throw new Error("A data de início não pode ser maior que a data atual.");
        }
    }

    isExpirada(): boolean {
        return this.dataFim.getTime() < Date.now();
    }

    GetStatus(): 'ativa' | 'pausada' | 'expirada' {
        if (this.isExpirada()) {
            return "expirada";
        } else
            return "ativa";
    }

    exibirInfo(): string {
        return `Campanha: ${this.nome}, Status: ${this.status}, Categoria: ${this.categoria}`;
    }
}