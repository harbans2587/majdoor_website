import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { User, EmployerProfile } from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const profile = await EmployerProfile.findOne({ userId: session.user.id })
    
    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    console.error('Get employer profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    await dbConnect()

    // Update or create employer profile
    const profileData = {
      userId: session.user.id,
      companyName: data.companyName,
      companyDescription: data.companyDescription,
      industry: data.industry,
      companySize: data.companySize,
      website: data.website,
      location: data.location,
      contactPerson: data.contactPerson,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone
    }

    const profile = await EmployerProfile.findOneAndUpdate(
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
    console.error('Save employer profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}