import AlunoModel from '../models/AlunoModel.js';
import {
    upload as uploadStorage,
    deletar as deletarStorage,
} from '../lib/helpers/arquivoHelper.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, turma, materia } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (!turma) {
            return res.status(400).json({ error: 'O campo "turma" é obrigatório!' });
        }
        if (!materia) {
            return res.status(400).json({ error: 'O campo "materia" é obrigatório!' });
        }

        const aluno = new AlunoModel({ nome, turma, materia, foto: null });
        const data = await aluno.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await AlunoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: aluno });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            aluno.nome = req.body.nome;
        }
        if (req.body.materia !== undefined) {
            aluno.materia = req.body.materia;
        }
        if (req.body.turma !== undefined) {
            aluno.turma = req.body.turma;
        }
        if (req.body.foto !== undefined) {
            aluno.foto = req.body.foto;
        }

        const data = await aluno.atualizar();

        return res
            .status(200)
            .json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await aluno.deletar();

        return res.status(200).json({
            message: `O registro "${aluno.nome}" foi deletado com sucesso!`,
            deletado: aluno,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};

// Fotos

export const uploadFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));
        if (!aluno) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        const urlPublica = await uploadStorage(id, req.file);

        aluno.foto = urlPublica;
        await aluno.atualizar();

        return res.status(200).json({ message: 'Foto atualizada com sucesso!', url: urlPublica });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar a foto.' });
    }
};

export const buscarFoto = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const aluno = await AlunoModel.buscarPorId(parseInt(id));
        if (!aluno) return res.status(404).json({ error: 'Registro não encontrado.' });
        if (!aluno.foto) return res.status(404).json({ error: 'Nenhuma foto cadastrada.' });

        return res.status(200).json({ url: aluno.foto });
    } catch (error) {
        console.error('Erro ao buscar foto:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto.' });
    }
};

export const deletarFoto = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const aluno = await AlunoModel.buscarPorId(parseInt(id));
        if (!aluno) return res.status(404).json({ error: 'Registro não encontrado.' });
        if (!aluno.foto) return res.status(404).json({ error: 'Nenhuma foto para remover.' });

        await deletarStorage(aluno.foto);

        aluno.foto = null;
        await aluno.atualizar();

        return res.status(200).json({ message: 'Foto removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover foto:', error);
        return res.status(500).json({ error: 'Erro ao remover foto.' });
    }
};
