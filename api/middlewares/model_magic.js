import mongoose from 'mongoose';

export default function (model, param = 'id') {
    let m = mongoose.model(model);
    return async function (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
            return next();
        }
        let found;
        try {
            found = await m.findById(req.params[param]);
        } catch (e) {
            return res.error('Could not query model');
        }
        if (!found) {
            return res.error(`${capitalize(model)} not found.`, 404);
        }
        if (!req[model]) {
            req[model] = found;
        }
        next();

        if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
            return next();
        }
        let found;
        try {
            found = await m.findById(req.params[param]);
        } catch (e) {
            return res.error('Could not query model');
        }
        if (!found) {
            return res.error(`${capitalize(model)} not found.`, 404);
        }
        if (!req[model]) {
            req[model] = found;
        }
        next();
    };
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
