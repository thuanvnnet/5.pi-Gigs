import connectDB from "@/lib/db";
import Favorite from "@/models/favorite";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";
// import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    // const sessionUser = await getSessionUser();
    // if (!sessionUser) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }
    // const userId = sessionUser.uid;
    const userId = "PiBuyer_Test"; // Giả lập là người mua để test

    const { gigId } = await req.json();

    if (!gigId) {
      return NextResponse.json({ success: false, error: "Gig ID is required" }, { status: 400 });
    }

    const existingFavorite = await Favorite.findOne({ userId, gigId });

    if (existingFavorite) {
      // If already favorited -> unfavorite
      await Favorite.findByIdAndDelete(existingFavorite._id);
      // Optional: Decrement favorites count on the Gig model
      // await Gig.findByIdAndUpdate(gigId, { $inc: { favoritesCount: -1 } });
      return NextResponse.json({ success: true, favorited: false, message: "Removed from favorites" });
    } else {
      // If not favorited -> favorite
      await Favorite.create({ userId, gigId });
      // Optional: Increment favorites count on the Gig model
      // await Gig.findByIdAndUpdate(gigId, { $inc: { favoritesCount: 1 } });
      return NextResponse.json({ success: true, favorited: true, message: "Added to favorites" });
    }
  } catch (error) {
    console.error("FAVORITE_UPDATE_ERROR:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}