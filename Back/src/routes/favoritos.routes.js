const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const svc  = require('../services/favoritos.service');

router.get('/',       auth, async (req, res, next) => { try { res.json(await svc.getMine(req.user.id));                          } catch(e){ next(e) }});
router.post('/',      auth, async (req, res, next) => { try { res.status(201).json(await svc.add(req.user.id, req.body.ofertaId)); } catch(e){ next(e) }});
router.delete('/:id', auth, async (req, res, next) => { try { res.json(await svc.remove(req.params.id));                         } catch(e){ next(e) }});

module.exports = router;