import express from 'express';
// 💡 ADICIONE ESTA LINHA AQUI NO TOPO:
import multer from 'multer';
import * as controller from '../controllers/alunoController.js';

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/', controller.criar);
router.get('/', controller.buscarTodos);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);


router.post('/:id/foto', upload.single('foto'), controller.uploadFoto);
router.get('/:id/foto', controller.buscarFoto);
router.delete('/:id/foto', controller.deletarFoto);


export default router;
