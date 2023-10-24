import { Request, Response,Router } from 'express';
import WhatsappRoute from "./whatsapp"; 
const router = Router()

router.use("/whatsapp", WhatsappRoute);

export default router;