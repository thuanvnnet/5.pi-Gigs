import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Order from '@/models/Order';

// A mock session function, replace with your actual session logic
async function getSession() {
    return { user: { username: 'mock-buyer-username' } }; 
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gigId = searchParams.get('gigId');

  if (!gigId) {
    return NextResponse.json({ success: false, error: 'Gig ID is required' }, { status: 400 });
  }

  try {
    await connectDB();

    // Find all reviews for the given gigId and sort them by creation date
    const reviews = await Review.find({ gigId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: reviews });

  } catch (error) {
    console.error('API GET /api/reviews Error:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { gigId, star, comment } = await request.json();

    // Optional but recommended: Check if the user has actually purchased this gig
    const hasPurchased = await Order.findOne({ gigId, buyerId: user.username, status: 'completed' });
    if (!hasPurchased) {
      return NextResponse.json({ success: false, error: 'You can only review gigs you have purchased and completed.' }, { status: 403 });
    }

    // Optional: Check if the user has already reviewed this gig
    const existingReview = await Review.findOne({ gigId, buyerId: user.username });
    if (existingReview) {
      return NextResponse.json({ success: false, error: 'You have already reviewed this gig.' }, { status: 400 });
    }

    const newReview = new Review({
      gigId,
      buyerId: user.username,
      star,
      comment,
    });

    await newReview.save(); // The 'post-save' middleware will trigger the calculation automatically

    return NextResponse.json({ success: true, data: newReview });
  } catch (error) {
    console.error('API POST /api/reviews Error:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}