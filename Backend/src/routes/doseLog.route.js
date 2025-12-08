import { Router } from 'express';
import { 
    logDoseTake,
    getRangerTimeline,
    getAdherenceStats
} from '../controllers/doseLog.controller.js'; 

import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = Router();

router.use(verifyJWT);         

router.route('/take/:capsuleId').post(verifyJWT,logDoseTake);  
router.route('/timeline').get(verifyJWT, getRangerTimeline); 
router.route('/adherence').get(verifyJWT, getAdherenceStats); 


export default router;