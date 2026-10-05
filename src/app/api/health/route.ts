// Healthcheck Probe Route for Google Cloud Run and Kubernetes Orchestration
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'the-kesari-bagh-platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      keys_available: 4,
    },
    { status: 200 }
  );
}
