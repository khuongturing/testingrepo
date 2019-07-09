let bcrypt = require('bcrypt')
let deletePassword = (obj) => {
    delete obj.dataValues.password;
    return obj
}

let hashPassword = password => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

let roundTo = (n, digits) => {
  var negative = false;
  if (digits === undefined) {
      digits = 0;
  }
      if( n < 0) {
      negative = true;
    n = n * -1;
  }
  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = +(Math.round(n) / multiplicator).toFixed(2);
  if( negative ) {    
      n = (n * -1).toFixed(2);
  }
  return n;
}

module.exports = {
  deletePassword, hashPassword, roundTo
}