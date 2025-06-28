import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Application, Job } from '@/models/Job'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId, employerId, coverLetter, proposedRate, estimatedDuration } = await request.json()

    if (!jobId || !employerId || !coverLetter) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await dbConnect()

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      workerId: session.user.id
    })

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 400 })
    }

    // Create new application
    const application = new Application({
      jobId,
      workerId: session.user.id,
      employerId,
      coverLetter,
      proposedRate,
      estimatedDuration
    })

    await application.save()

    // Increment applications count on the job
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    })

    return NextResponse.json({
      message: 'Application submitted successfully',
      application
    }, { status: 201 })
  } catch (error) {
    console.error('Submit application error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    await dbConnect()

    let query: any = {}
    
    if (session.user.userType === 'worker') {
      query.workerId = session.user.id
    } else if (session.user.userType === 'employer') {
      query.employerId = session.user.id
    }

    if (jobId) {
      query.jobId = jobId
    }

    const applications = await Application.find(query)
      .populate('jobId', 'title budget jobType')
      .populate('workerId', 'name')
      .populate('employerId', 'name')
      .sort({ createdAt: -1 })

    return NextResponse.json({ applications }, { status: 200 })
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}