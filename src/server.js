import express from 'express';
import 'dotenv/config';
import alunoRoute from './routes/alunoRoute.js';
import { apiKey } from './lib/middlewares/apiKey.js';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api/alunos', apiKey, alunoRoute);


app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
