const jwt = require('jsonwebtoken');
const axios = require('axios');
var jwkToPem = require('jwk-to-pem');
require('dotenv').config();

const validateToken = async (req, res, next) => {
    try {
        const publicKey = await axios.get('https://www.googleapis.com/oauth2/v3/certs');
        const token = req.headers.authorization.split(" ")[1];
        const header = jwt.decode(token, { complete: true }).header;
        const cert = publicKey?.data.keys.filter( ele => ele.kid === header?.kid )[0];

        if (cert == null || cert?.kid !== header?.kid) {
            console.log(cert, header);
            res.status(403).json({message: "unauthorized, invalid token"})
            return;
        }
        
        const clientID = process.env.CLIENT_ID;
        const pem = jwkToPem(cert);
        const decoded = jwt.verify(token, pem, { algorithms: [`${header?.alg}`], audience: clientID, issuer: 'https://accounts.google.com'}, (err, payload) => {
            if (err) {
              // Not a valid token
              console.log('Error:', err);
              
              return false;
            }
            // Token successfully verified
            return true;
        });

        console.log("decoded is : ", decoded);
        if(!decoded){
            res.status(403).json({message: "unauthorized, invalid token"});
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({message: "unauthorized, invalid token"});
        return;
    }
}

module.exports = {
    validateToken,
}