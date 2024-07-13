// const { json } = require("express");
const etag = require("etag");
const { client } = require("../config/db");
const { validateJsonSchema } = require("../schema/schemaValidator");
const { fetchPlans } = require("../utils/fetchAllPlans");
const merge = require('deepmerge-json');
const { patchPlanData } = require("../utils/patchPlan");

const savePlan = async(req, res) => {
    try {
        const payload = req.body
        if (payload == null) {
            res.status(400).json({"message": "payload is empty"});
            return
        }

        const planID = payload?.objectId;
        if (planID == null) {
            res.status(400).json({"message": "planID is missing"});
            return
        }

        const isSchemaValid = validateJsonSchema(payload);
        if(!isSchemaValid){
            res.status(400).json({"message": `Schema is not valid, validator response : ${isSchemaValid}`})
            return 
        }

        const planDetails = await client.hGet(planID, "plan");
        if (planDetails != null || planDetails == "" || planDetails == {}) {
            res.status(409).json({"message": "Plan already exists"});
            return 
        }

        await client.hSet(planID, "plan", JSON.stringify(payload))
        const eTag = etag(JSON.stringify(payload))
        console.log("etag is : ", eTag)
        await client.hSet(planID, "eTag", eTag);

        res.setHeader("ETag", eTag);
        res.status(201).json({message: "payload saved"})
        return

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in saving the plan"})
    }
} 

const getPlanById = async (req, res) => {
    try {
        const { planid } = req.params;
        if (planid == null || planid == "" || planid == {}) {
            res.status(400).json({"message": "please provide a plan id to fetch the details"})
            return
        }

        const etagHeader = req.headers['if-none-match'];
        const eTagSign = await client.hGet(planid, "eTag");
        if(etagHeader){
            if(eTagSign == etagHeader){
                console.log("hello from etag");
                res.setHeader("ETag", eTagSign);
                res.status(304).json({ message: "plan not updated"})
                return
            }
        }

        const planDetails = await client.hGet(planid, "plan");
        const planDetailsPayload = JSON.parse(planDetails);

        if (planDetails == null || planDetails == "") {
            res.status(404).json({"message": "Plan doesnt exits"})
            return;
        }

        res.setHeader("ETag", eTagSign);
        res.status(200).json({message: "payload fetched successfully", data: planDetailsPayload});

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in fetching the plan details"})
    }
}

const deletePlanByID = async(req, res) => {
    try {
        const { planid } = req.params;
        if (planid == null || planid == "" || planid == {}) {
            res.status(400).json({"message": "please provide a plan id to delete the details"})
            return
        }

        const response = await client.del(planid)
        console.log("delete response", response)
        if (response == 0) {
            res.status(404).json({message: "plan not found in database"});
            return    
        }

        res.status(200).json({message: "plan deleted"});
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in deleting the plan"})
    }
}

const getAllPlans = async (req, res) => {
    try {
        const keysval = await client.keys("*")
        if(keysval.length === 0){
            res.status(404).json({message: "No data found in the database"});
            return;
        }

        const plans = await fetchPlans(keysval);
        res.status(200).json({ message: plans });

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in deleting the plan"})
    }
}

const patchPlan = async (req, res) => {
    try {
        // const after = merge(planObject, updates);

        const { planid } = req.params;
        const patchPlan = req.body;
        
        const plan = await client.hGet(planid, "plan");    
        const planDetails = JSON.parse(plan);
        const planData = patchPlanData(planDetails, patchPlan);
        
        const isSchemaValid = validateJsonSchema(planData);
        if(!isSchemaValid){
            res.status(400).json({"message": `Schema is not valid, validator response : ${isSchemaValid}`});
            return; 
        }

        await client.hSet(planid, "plan", JSON.stringify(planData));
        const eTag = etag(JSON.stringify(planData));
        console.log("etag is : ", eTag);
        await client.hSet(planid, "eTag", eTag);
        
        const eTagSign = await client.hGet(planid, "eTag");
        if(eTagSign == req.headers['if-none-match']){
            console.log("hello from etag");
            res.setHeader("ETag", eTagSign);
            res.status(304).json({ message: "plan not updated"});
            return
        }

        res.setHeader("ETag", eTag);
        res.status(200).json({data: planData});
        return; 
    } catch (error) {
        console.log(error);
        return;
    }
}

module.exports = {
    getAllPlans,
    savePlan,
    getPlanById,
    deletePlanByID,
    patchPlan
}