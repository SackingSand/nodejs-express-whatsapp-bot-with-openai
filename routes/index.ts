import { Request, Response, Router } from 'express';
import ApiV1 from "./v1/";

const router = Router()

router.use("/v1/api", ApiV1);

router.get('/*', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

export default router;
