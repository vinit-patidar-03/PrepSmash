import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { connectDB } from "@/lib/db";
import { INTERVIEW_MODEL } from "@/models";
import USER_BOOKMARKS from "@/models/bookmarked-interviews";

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getUserId("access");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: No user ID" }, { status: 401 });
    }

    const formData = await req.formData();

    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    const technologiesStr = formData.get("technologies") as string;
    const difficulty = formData.get("difficulty") as string;
    const duration = Number(formData.get("duration"));
    const questionsStr = formData.get("questions") as string;
    const description = formData.get("description") as string;
    const resume = formData.get("Resume");
    const isPersonal = !!(resume instanceof File && resume.size > 0);

    if (!company || !role || !technologiesStr || !difficulty || !duration || !questionsStr || !description) {
      return NextResponse.json({ success: false, message: "Missing required field" }, { status: 400 });
    }

    const technologies = JSON.parse(technologiesStr);
    const questions = JSON.parse(questionsStr);

    await connectDB();

    const interview = await INTERVIEW_MODEL.create({
      company,
      role,
      technologies,
      difficulty,
      duration,
      questions,
      description,
      userId,
      isPersonal
    });

    await USER_BOOKMARKS.create({
      user: userId,
      interview: interview._id
    });


    return NextResponse.json({ success: true, data: interview }, { status: 200 });
  } catch (error) {
    console.error("Error creating interview", error);
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 });
  }
};