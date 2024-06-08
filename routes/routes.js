const express = require('express');
const { savePlan, getPlanById, deletePlanByID } = require('../controllers/crud');

const appRouter = express.Router();

appRouter.post("/v1/set/plan", savePlan)
appRouter.get("/v1/get/plan/:planid", getPlanById)
appRouter.delete("/v1/del/plan/:planid", deletePlanByID)

module.exports = appRouter