// require('dotenv').config()

// const {OAuth2Client} = require('google-auth-library');
// const client = new OAuth2Client();
// async function validateToken(req, res, next) {
//     const token = req.headers.authorization.split(" ")[1];
//     console.log(token)
//   const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//       // Or, if multiple clients access the backend:
//       //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//   });
//   const payload = ticket.getPayload();
//   const userid = payload['sub'];

//   console.log(payload, userid);
//   next();
// }

// module.exports = {
//     validateToken
// }