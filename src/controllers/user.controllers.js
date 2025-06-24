import { asyncHandler } from "../utils/asyncHandles.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uplodonCloudnary} from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findByPk(userId)
        const accessToken = user.generateAccessToken()
        console.log("This is the access Token", accessToken);
        const refreshToken = user.generateRefreshToken();
        console.log("This is the referesh Token", refreshToken);

        user.refreshToken = refreshToken
        await user.save({validate: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh token")
    }
}

const registerUser = asyncHandler( async (req, res) =>{
    // get user date from frontend
    // validation - not empty
    // check if user already exists: usrname, email
    // check for images, check for avatar
    // uload them to cloudnary, avatar
    // create user object - create entry in db
    // remove password and refresh token field form  response
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

const loginuser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refersh token
    // send cookie

    const {email, username, password} = req.body

    if (!username && !email) { //koi bhe ek na ho toh
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({ //checking user in database
        where: {
            [Op.or]: [
                {username},
                {email}
            ]
        }
    });

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid user password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user.id)

    const loggedInUser = await User.findByPk(user.id, {
        attributes: {
            exclude: ["password", "refreshToken"] //these field os not required
        }
    })

    const options = {
        httpOnly: true,
        secure: false, // true if using HTTPS
        sameSite: "lax"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.update(
        { 
            refreshToken : null
        },
        {
            where: {id: req.user.id}
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // access referesh token
    const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshtoken) {
        throw new ApiError(401, "unauthorize request token not correct")
    }
    try {
        const decodedToken = jwt.verify( //decoded token
            incomingRefreshtoken, 
            process.env.ACCESS_TOKEN_SECRET
        )
    
        const user = await User.findByPk(decodedToken?.id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh Token")
        }
    
        if (incomingRefreshtoken !== user?.refreshToken) {
            throw new ApiError(401, "Referesh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: false
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(user.id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, 
                    refreshToken: newrefreshToken,
                },
                "Access token refereshed"
                
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refersh Token")
    }
})

export {
    registerUser,
    loginuser,
    logoutUser,
    refreshAccessToken
}