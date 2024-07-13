const patchPlanData = (planDetails, patchPlan) => {
    for (const [key, value] of Object.entries(patchPlan)){
        if (key === "planCostShares"){
            if ("planCostShares" in planDetails){
                planDetails["planCostShares"] = value;
            }
        }

        if (key === "linkedPlanServices"){
            let found = false;
            value.forEach(service => {
                planDetails["linkedPlanServices"].forEach((existingService, idx) => {
                    if(existingService["objectId"] === service["objectId"]){
                        found = true;
                        planDetails["linkedPlanServices"][idx] = service;    
                    }
                })
                if (!found){
                    planDetails["linkedPlanServices"].push(service);
                }
            });
        }
    }

    return planDetails;
}

module.exports = {
    patchPlanData
}