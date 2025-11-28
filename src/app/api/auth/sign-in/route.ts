import {USER} from "@/models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { generateAccessToken, generateRefreshToken} from "@/lib/session";



export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const user = await USER.findOne({ email });

        if (!user) {
            return NextResponse.json({success: false, message: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        const response = NextResponse.json({ success: true, data: user?._id }, { status: 200 });
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            path: "/",
            sameSite: "lax"
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 604800,
            path: "/",
            sameSite: "lax"
        });
        return response;

    } catch (error) {
        console.error("Error logging in user:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}