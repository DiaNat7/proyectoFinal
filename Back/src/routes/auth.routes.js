const router = require('express').Router();
const svc = require('../services/auth.service');

router.post('/register', async (req, res, next) => {
  try { res.status(201).json(await svc.register(req.body)); } catch(e){ next(e) }
});

router.post('/login', async (req, res, next) => {
  try { res.json(await svc.login(req.body)); } catch(e){ next(e) }
});

module.exports = router;