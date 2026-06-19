import prisma from '../lib/services/prismaClient.js';

export default class AlunoModel {
    constructor({ id = null, nome, turma, foto = null, materia } = {}) {
        this.id = id;
        this.nome = nome;
        this.turma = turma;
        this.foto = foto;
        this.materia = materia;
    }

    async criar() {
        return prisma.aluno.create({
            data: {
                nome: this.nome,
                turma: this.turma,
                foto: this.foto,
                materia: this.materia
            },
        });
    }

    async atualizar() {
        return prisma.aluno.update({
            where: { id: this.id },
            data: { nome: this.nome, turma: this.turma, foto: this.foto, materia: this.materia },
        });
    }

    async deletar() {
        return prisma.aluno.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.turma) {
            where.turma = { contains: filtros.turma, mode: 'insensitive' };
        }
        if (filtros.materia) {
            where.materia = { contains: filtros.materia, mode: 'insensitive' };
        }
        if (filtros.foto !== undefined) {
            where.foto = filtros.foto === 'true';
        }

        return prisma.aluno.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.aluno.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new AlunoModel(data);
    }
}
