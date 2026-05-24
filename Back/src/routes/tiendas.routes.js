const router = require('express').Router();
const svc = require('../services/tiendas.service');

router.get('/',       async (req, res, next) => { try { res.json(await svc.getAll());                          } catch(e){ next(e) }});
router.get('/:id',    async (req, res, next) => { try { res.json(await svc.getById(req.params.id));            } catch(e){ next(e) }});
router.post('/',      async (req, res, next) => { try { res.status(201).json(await svc.create(req.body));      } catch(e){ next(e) }});
router.put('/:id',    async (req, res, next) => { try { res.json(await svc.update(req.params.id, req.body));   } catch(e){ next(e) }});
router.delete('/:id', async (req, res, next) => { try { res.json(await svc.remove(req.params.id));            } catch(e){ next(e) }});

module.exports = router;