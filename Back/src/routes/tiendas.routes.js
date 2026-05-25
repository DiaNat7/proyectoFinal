const router = require('express').Router();
const svc = require('../services/tiendas.service');

router.get('/',       verificarToken, async (req, res, next) => { try { res.json(await svc.getAll());               } catch(e){ next(e) }});
router.get('/:id',    verificarToken, async (req, res, next) => { try { res.json(await svc.getById(req.params.id)); } catch(e){ next(e) }});

// Solo admin puede crear, editar, eliminar
router.post('/',      verificarToken, verificarAdmin, async (req, res, next) => { try { res.status(201).json(await svc.create(req.body));            } catch(e){ next(e) }});
router.put('/:id',    verificarToken, verificarAdmin, async (req, res, next) => { try { res.json(await svc.update(req.params.id, req.body));         } catch(e){ next(e) }});
router.delete('/:id', verificarToken, verificarAdmin, async (req, res, next) => { try { res.json(await svc.remove(req.params.id));                   } catch(e){ next(e) }});



module.exports = router;