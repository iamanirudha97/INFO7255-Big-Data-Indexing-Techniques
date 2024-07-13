const express = require('express');
const { savePlan, getPlanById, deletePlanByID, getAllPlans, patchPlan } = require('../controllers/crud');
const { validateToken } = require('../middlewares/auth');

const appRouter = express.Router();

appRouter.post("/v1/plan", validateToken, savePlan);
appRouter.get("/v1/plan/:planid", validateToken, getPlanById);
appRouter.delete("/v1/plan/:planid", validateToken, deletePlanByID);
appRouter.get("/v1/plans",validateToken, getAllPlans);
appRouter.patch("/v1/plan/:planid", validateToken, patchPlan);

module.exports = appRouter;