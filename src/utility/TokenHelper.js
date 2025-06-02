require('dotenv').config();

const jwt = require('jsonwebtoken')

exports.EncodeToken = (email,userID) => {
  let Payload = {email:email, userID:userID}
    let Key = process.env.JWT_SECRET;
    let Expires = {expiresIn: '30d'}

    return jwt.sign(Payload,Key,Expires)
}


exports.DecodeToken = (token) => {
    let Key = process.env.JWT_SECRET;

    return jwt.verify(token,Key)
}