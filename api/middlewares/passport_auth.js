import passport from 'passport';

export default function (req, res, next) {
    passport.authenticate('bearer-validate', {
        session: false
    }, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};
