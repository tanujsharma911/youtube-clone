// import asyncHandler from "../utils/asyncHandler";


// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });

const getProfile = (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
};

export { getProfile };