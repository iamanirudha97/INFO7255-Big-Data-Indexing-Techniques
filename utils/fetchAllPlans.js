const { client } = require("../config/db");

const fetchPlans = async (keys) => {
    var plans = [];
    for(let i=0; i < keys.length; i++){
        let plan = await client.hGet(keys[i], "plan")
        plans.push(JSON.parse(plan));
    }

    console.log(plans);
    return plans;
}

module.exports = {
    fetchPlans
}