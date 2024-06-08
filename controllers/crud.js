const { json } = require("express")
const { client } = require("../config/db")

const savePlan = async(req, res) => {
    try {
        const payload = req.body
        if (payload == null) {
            res.status(400).json({"message": "payload is empty"})
            return
        }

        const planID = payload?.objectId
        if (planID == null) {
            res.status(400).json({"message": "planID is missing"})
            return
        }

        const planDetails = await client.get(planID);

        if (planDetails != null || planDetails == "") {
            res.status(409).json({"message": "Plan already exists"})
            return 
        }

        client.set(planID, JSON.stringify(payload))
        res.status(200).json({message: "payload saved"})
        return

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in saving the plan"})
    }
} 

const getPlanById = async (req, res) => {
    try {
        const {planid } = req.params;
        if (planid == null || planid == "" || planid == {}) {
            res.status(400).json({"message": "please provide a plan id to fetch the details"})
            return
        }

        const planDetails = await client.get(planid);
        const planDetailsPayload = JSON.parse(planDetails)

        if (planDetails == null || planDetails == "") {
            res.status(409).json({"message": "Plan doesnt exits"})
            return 
        }

        res.status(200).json({message: "payload fetched successfully", data: planDetailsPayload});
        return

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

        if (response == 0) {
            res.status(404).json({message: "plan not found in database", data: response});
            return    
        }

        res.status(200).json({message: "plan deleted", data: response});
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in deleting the plan"})
    }
}

module.exports = {
    savePlan,
    getPlanById,
    deletePlanByID
}