const User = require('../model/user');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const user = await User.find({ refreshToken:refreshToken })
    const foundUser = user[0]? user[0] : null;  
    //const doundCandidate = await UserD.find({ userid: foundUser?._id })
    //const candidate = doundCandidate[0]? doundCandidate[0] : null;

    console.log(foundUser);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const role = foundUser.role
            console.log(role);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                       
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({  accessToken, foundUser })
            console.log(accessToken, foundUser);
        }
    );
}

module.exports = { handleRefreshToken }