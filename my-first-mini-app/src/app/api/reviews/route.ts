import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { verifyCloudProof } from '@worldcoin/minikit-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rating, comment, businessId, userId, username, worldIdProof } = body;

    // Require World ID proof
    if (!worldIdProof) {
      return NextResponse.json(
        { error: 'World ID verification required.' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!rating || !comment || !businessId || !userId || !username) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate comment length
    if (comment.length < 10 || comment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    // Verify World ID proof
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
    const action = 'leave-review';
    const verifyRes = await verifyCloudProof(
      worldIdProof,
      app_id,
      action,
      undefined
    );
    if (!verifyRes.success) {
      return NextResponse.json(
        { error: 'World ID verification failed.' },
        { status: 403 }
      );
    }

    // Optionally, prevent double submissions by nullifier hash
    const nullifierHash = worldIdProof.nullifier_hash;
    const existing = await prisma.review.findFirst({
      where: { userId, businessId },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'You have already reviewed this business' },
        { status: 409 }
      );
    }

    // Save the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        businessId,
        userId,
        username,
        // Optionally, store nullifierHash for audit
        // nullifierHash,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'You have already reviewed this business' },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          businessId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          businessId,
        },
      }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 