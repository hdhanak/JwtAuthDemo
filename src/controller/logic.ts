import { NextFunction, Request, Response } from "express";
import { ErrorMessage, MessageResponse } from "../middleware/common";
import signUp from "../model/register";
import tokenModel from "../model/token";
const { phone } = require("phone");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Appstring = require("../Appstring");
require("dotenv").config();

const register = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await signUp.create({
      firstName: req.body.firstName,
      email: req.body?.email,
      password: hashPassword,
      PhoneNo: req.body.PhoneNo
        ? phone(req.body?.PhoneNo)?.phoneNumber
        : undefined, //PhoneNo.phoneNumber,
      role: req.body.role,
    });

    await user.save();

    MessageResponse(req, res, user, 201);
  } catch (error) {
    console.log(error, "error");

    ErrorMessage(req, res, error, 400);
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const user = await signUp.findOne({
      email: req.body?.email,
      PhoneNo: req.body?.PhoneNo,
    });

    const userLogin = await tokenModel.findOne({ userId: user?._id });
    // console.log('1',user);

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      // console.log('v');

      if (validPassword) {
        console.log(userLogin, "userLogin");

        if (userLogin) {
          console.log("v");
          let params = {
            _id: user._id,
            firstName: user.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
            role: user?.role,
          };
          console.log("2");
          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          console.log("3");
          await tokenModel.updateOne(
            { userId: user._id },
            { token: token },
            {
              new: true,
            }
          );
          return res
            .cookie("access_token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({
              message: "Logged in successfully 😊 👌",
              access_token: token,
            });

          // tokenAccess(req, res, token, 200);
        } else {
          let params = {
            _id: user._id,
            firstName: req.body.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
            role: user?.role,
          };
          console.log("vv");

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          console.log("c");

          const createToken = await tokenModel.create({
            userId: user._id,
            token: token,
          });
          await createToken.save();
          return res
            .cookie("access_token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({
              message: "Logged in successfully 😊 👌",
              access_token: token,
            });

          // tokenAccess(req, res, createToken, 200);
        }
      } else {
        ErrorMessage(req, res, Appstring.NOT_VALID_DETAILS, 400);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 400);
  }
};
const getRegisterList = async (req: Request, res: Response) => {
  try {
    console.log('u');    
    const users = await signUp.find();
    console.log(users,'users');
    
    return MessageResponse(req, res, users, 200);
  } catch (error) {
    console.log(error, "error");

    return ErrorMessage(req, res, error, 412);
  }
};
export { register, login,getRegisterList };
