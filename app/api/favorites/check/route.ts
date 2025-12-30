import connectDB from "@/lib/db";
import Favorite from "@/models/Favorite";
import { NextResponse } from "next/server";
// import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    // const sessionUser = await getSessionUser();
    // if (!sessionUser) {
    //   return NextResponse.json({ success: true, data: {} }); // Not logged in, no favorites
    // }
    // const userId = sessionUser.uid;
    const userId = "PiBuyer_Test"; // Giả lập là người mua để test

    const { gigIds } = await req.json();

    if (!Array.isArray(gigIds) || gigIds.length === 0) {
      return NextResponse.json({ success: true, data: {} });
    }

    // Find all favorites for the user that are in the provided gigIds list
    const favorites = await Favorite.find({ userId, gigId: { $in: gigIds } });

    // Create a map to return the results: { "gigId1": true, "gigId2": false, ... }
    const favoritedStatusMap: { [key: string]: boolean } = {};
    gigIds.forEach(id => favoritedStatusMap[id] = false);
    favorites.forEach(fav => {
      favoritedStatusMap[fav.gigId.toString()] = true;
    });

    return NextResponse.json({ success: true, data: favoritedStatusMap });
  } catch (error) {
    console.error("FAVORITE_CHECK_ERROR:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}