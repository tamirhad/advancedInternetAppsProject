const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  passReqToCallback: true
}


const strategy = new JwtStrategy(options, (req,payload,done)=> {
  User.findOne({_id: payload.sub }).then((user)=>{
    if(user){
      req.userId = payload.sub;
      return done(null,user);
    }
    else{
      return done(null,false);
    }

  }).catch(error=>done(error,null));

});


module.exports = (passport) => {
  passport.use(strategy);
}