const router = require('express').Router();
const svc  = require('../services/favoritos.service');
const { verificarToken } = require('../middlewares/auth.middleware');

// OBTENER MIS FAVORITOS
router.get('/', verificarToken, async (req, res, next) => { 
  try { 
    const userId = req.user.id || req.user._id; 
    res.json(await svc.getMine(userId)); 
  } catch(e){ 
    res.status(e.status || 500).json({ error: e.message || "Error al obtener favoritos" });
  }
});

// AGREGAR UN FAVORITO
router.post('/', verificarToken, async (req, res, next) => { 
  try { 
    const userId = req.user.id || req.user._id;
    const ofertaId = req.body.ofertaId;

    res.status(201).json(await svc.add(userId, ofertaId)); 
  } catch(e){ 
    res.status(e.status || 500).json({ error: e.message || "Error al agregar a favoritos" });
  }
});

// ELIMINAR UN FAVORITO
router.delete('/:id', verificarToken, async (req, res, next) => { 
  try { 
    res.json(await svc.remove(req.params.id)); 
  } catch(e){ 
    res.status(e.status || 500).json({ error: e.message || "Error al eliminar favorito" });
  }
});

module.exports = router;