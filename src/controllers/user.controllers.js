import { asyncHandler } from "../utils/asyncHandles.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uplodonCloudnary} from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Op } from "sequelize";

const registerUser = asyncHandler( async (req, res) =>{
    // get user date from frontend
    // validation - not empty
    // check if user already exists: usrname, email
    // check for images, check for avatar
    // uload them to cloudnary, avatar
    // create user object - create entry in db
    // remove password and referesh token field form  response
    // check for user creation
    // return response

    //Taking input from frontend
    const {fullname, email, username, password} = req.body
    console.log("requestBody", req.body);

    // Checking validation not empty
    if(
        [fullname, email, username, password].some((field) => 
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const exiteduser = await User.findOne({ //retrive a data from database
        where: {
            [Op.or]: [
                { username: username.toLowerCase().trim() },
                { email: email.toLowerCase().trim() }
            ]
        }
    });


    if (exiteduser) {
        throw new ApiError(409, "User with email or username alredy exsits")
    }

    const avatarLoacalPath = req.files?.avatar?.[0]?.path;
    const coverImageLoacalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLoacalPath) { //checking image
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uplodonCloudnary(avatarLoacalPath)
    const coverImage = await uplodonCloudnary(coverImageLoacalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({ //Creating entry of a user in Database
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createduser = await User.findByPk(user.id, { //remove password or change password mode
        attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!createduser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "User registerd successfully")
    )
})


export {registerUser}