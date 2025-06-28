import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { User, WorkerProfile } from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const profile = await WorkerProfile.findOne({ userId: session.user.id })
    
    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    console.error('Get worker profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    await dbConnect()

    // Update or create worker profile
    const profileData = {
      userId: session.user.id,
      title: data.title,
      bio: data.bio,
      skills: data.skills,
      hourlyRate: data.hourlyRate,
      availability: data.availability,
      location: data.location,
      experience: data.experience?.filter((exp: any) => exp.company || exp.position) || [],
      education: data.education?.filter((edu: any) => edu.institution || edu.degree) || []
    }

    const profile = await WorkerProfile.findOneAndUpdate(
      { userId: session.user.id },
      profileData,
      { upsert: true, new: true }
    )

    // Update user's profileComplete status
    await User.findByIdAndUpdate(session.user.id, { profileComplete: true })

    return NextResponse.json({ 
      message: 'Profile saved successfully',
      profile 
    }, { status: 200 })
  } catch (error) {
    console.error('Save worker profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}