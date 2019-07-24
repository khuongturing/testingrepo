import jwt from 'jsonwebtoken';

class Auth {

    static authenticate(customer_id, next) {
        let expiresIn = 14 * 24 * 60 * 1000;
        let accessToken = 'Bearer ' + jwt.sign({ customer_id }, process.env.JWT_KEY, { algorithm: 'HS256', expiresIn });
        next(expiresIn, accessToken);
    }

    static isAuthenticated(req, next) {
        var userkey = req.headers['user-key'];
        if (!userkey)
            next({ status: false, code:'AUT_01', message: 'Authorization code is empty.' });
        else {
            var bearer = userkey.split(" ")[0];
            if (!bearer)
                next({ status: false, code:'AUT_01', message: 'Authorization code is empty.' });
            else {
                var token = userkey.split(" ")[1];

                jwt.verify(token, process.env.JWT_KEY, { algorithm: 'HS256' }, function (err, decoded) {
                    if (err)
                        next({ status: false, code:'AUT_02', message: 'Access Unauthorized.' });
                    else
                        next({ status: true, decoded });
                });
            }
        }
    }
}

export default Auth;
