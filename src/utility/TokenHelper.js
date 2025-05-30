const jwt = require('jsonwebtoken')

exports.EncodeToken = (email,userID) => {
  let Payload = {email:email, userID:userID}
    let Key = "ABC-123-LLL"
    let Expires = {expiresIn: '48h'}

    return jwt.sign(Payload,Key,Expires)
}


exports.DecodeToken = (token) => {
    let Key = "ABC-123-LLL"

    return jwt.verify(token,Key)
}