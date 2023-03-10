import { NextFunction, Request, Response } from "express";
import signUp from "../model/register";
import { ErrorMessage } from "./common";

// import { ErrorMessage } from "./commenResError"
const AppString = require("../Appstring");
const jwt = require("jsonwebtoken");

declare global {
  namespace Express {
    interface Request {
      userId: any;
      userType: any;
      empId: any;
      // cookies:any
    }
  }
}

// const auth = async (req: Request, res: Response, next: NextFunction) => {

//     const token = req.cookies.access_token;
//     if (!token) {
//         return ErrorMessage(req, res, 'token not found', 401);

//     }

//     await jwt.verify(token, process.env.SECRET_KEY, {}, async (error: any, data: any) => {
//         if (error) {
//             if (error.name == "TokenExpiredError") {

//                 return ErrorMessage(req, res, "TOKEN_EXPIRED", 401)

//             } else {

//                 return ErrorMessage(req, res, "INVALID_SESSION", 401)
//             }
//         }
//         else {

//             next()

//         }
//     })

//     // }

// }
// // const verficationOfToken = async (token:any) => {
// //     return new Promise((resolve, reject) => {
// //         jwt.verify(token, process.env.SECRET_KEY, async (err: any, user: any) => {
// //             if (err) {
// //                 if (err.name == "TokenExpiredError") {
// //                     reject(AppString.TOKEN_EXPIRED);
// //                 } else {
// //                     reject(AppString.INVALID_SESSION);
// //                 }
// //             } else {
// //                 let midLayer = decrypt(user.sub, process.env.OUTER_KEY_PAYLOAD)
// //                 const userData = JSON.parse(decrypt(midLayer, process.env.OUTER_KEY_USER));
// //                 let blackListed: [] = await redisClient.lrange('BL_' + midLayer.toString(), 0, -1)
// //                 let blackListed_ = blackListed.find(value => value == token)
// //             }
// //         }

// //         )
// //     })
// // }

// // async function verifyToken(req: any, res: Response, next: Function) {
// //     let tokens_ = req.headers?.authorization?.split(' ') ?? []
// //     if(tokens_.length <= 1){
// //         return commonUtils.sendError(req, res, { message: AppStrings.INVALID_TOKEN }, 401);
// //     }
// //     const token = tokens_[1];
// //     verficationOfToken(token).then((userObj: any) => {
// //         req.headers.userid = userObj.userId;
// //         req.headers.device = userObj.device;
// //         req.headers.isguest = userObj?.isGuest;
// //         next();
// //     }).catch((err: any) => {
// //         return commonUtils.sendError(req, res, {message: err}, 401);
// //     })
// // }
// export default auth

var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
// console.log(typeof(JwtStrategy),'JwtStrategy');

module.exports = function (passport: any) {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      function (jwt_payload: any, cb: any) {

        const isUser = signUp.findOne({ email: jwt_payload.email });
        if (!isUser) {
          return cb("err", false);
        } else {
          cb(null, isUser);
        }
      }
    )
  );
};
