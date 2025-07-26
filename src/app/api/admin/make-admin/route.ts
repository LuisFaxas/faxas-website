import { NextRequest, NextResponse } from 'next/server';
import { makeUserAdminByEmail } from '@/lib/firebase-admin';
import { auth } from '@/lib/firebase/config';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, we'll require a secret key in the environment
    // In production, you'd verify the JWT token
    const secretKey = process.env.ADMIN_SECRET_KEY;
    if (!secretKey || authorization !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { error: 'Invalid authorization' },
        { status: 401 }
      );
    }

    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await makeUserAdminByEmail(email);
    
    return NextResponse.json(
      { message: `Successfully made ${email} an admin` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in make-admin API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to make user admin' },
      { status: 500 }
    );
  }
}