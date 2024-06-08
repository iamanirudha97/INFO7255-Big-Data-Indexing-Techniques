const express = require('express');
const { savePlan, getPlanById, deletePlanByID, getAllPlans } = require('../controllers/crud');

const appRouter = express.Router();

appRouter.post("/v1/plan", savePlan)
appRouter.get("/v1/plan/:planid", getPlanById)
appRouter.delete("/v1/plan/:planid", deletePlanByID)
appRouter.get("/v1/plans", getAllPlans)

module.exports = appRouter