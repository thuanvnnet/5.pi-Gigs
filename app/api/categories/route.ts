import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error("GET_CATEGORIES_ERROR:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}