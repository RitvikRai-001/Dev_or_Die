import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'; 
import { 
    createCapsule,
    getRangerCapsules,
    updateCapsule,
    deleteCapsule
} from '../controllers/capsule.controller.js'; 



const capsuleRouter = Router();

// Apply JWT verification to all capsule routes
capsuleRouter.use(verifyJWT);

capsuleRouter.route('/').post(verifyJWT,createCapsule);
capsuleRouter.route('/').get(verifyJWT,getRangerCapsules);
capsuleRouter.route('/:id').put(verifyJWT,updateCapsule);
capsuleRouter.route('/:id').delete(verifyJWT,deleteCapsule);

export default capsuleRouter;  
    




   
 



