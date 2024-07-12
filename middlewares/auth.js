const jwt = require('jsonwebtoken');
const axios = require('axios');
var jwkToPem = require('jwk-to-pem');
require('dotenv').config();

const validateToken = async (req, res, next) => {
    try {
        const publicKey = await axios.get('https://www.googleapis.com/oauth2/v3/certs');
        const cert = publicKey?.data.keys.filter( ele => ele.kid === "0e345fd7e4a97271dffa991f5a893cd16b8e0827")[0];
        console.log('public key is ', cert)
        if (cert == null) {
            res.status(403).json({message: "unauthorized, invalid token"})
            return
        }

        const token = req.headers.authorization.split(" ")[1];
        const header = jwt.decode(token, { complete: true }).header;
        console.log(header);
        const clientID = process.env.CLIENT_ID;
        const pem = jwkToPem(cert)

        jwt.verify(token, pem, { algorithms: ['RS256'], audience: clientID, issuer: 'https://accounts.google.com'}, (err, payload) => {
            if (err) {
              // Not a valid token
              console.log('Error:', err);
              return;
            }
        
            // Token successfully verified
            console.log('Payload:', payload);
        });
        next();
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    validateToken
}