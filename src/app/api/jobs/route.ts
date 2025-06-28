import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Job } from '@/models/Job'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    await dbConnect()

    const jobs = await Job.find({ status: 'active' })
      .populate('employerId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Job.countDocuments({ status: 'active' })

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Get jobs error:', error)
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

    const job = new Job({
      employerId: session.user.id,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      skillsRequired: data.skillsRequired,
      jobType: data.jobType,
      experienceLevel: data.experienceLevel,
      budget: data.budget,
      location: data.location,
      duration: data.duration,
      deadline: data.deadline
    })

    await job.save()

    return NextResponse.json({
      message: 'Job posted successfully',
      job
    }, { status: 201 })
  } catch (error) {
    console.error('Post job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}