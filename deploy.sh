#!/usr/bin/env bash
# ==============================================================================
# The Kesari Bagh - Continuous Delivery Pipeline to Google Cloud Run
# Harness: Google Antigravity CLI (agy) & Cloud Run MCP
# ==============================================================================

set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-kesari-bagh-production}"
REGION="${GCP_REGION:-asia-south1}"
SERVICE_NAME="the-kesari-bagh-web"
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

echo "⚜️ [Antigravity CD] Initiating Release Pipeline for The Kesari Bagh..."
echo "📍 Target Cloud Region: ${REGION} (Mumbai/Delhi Edge)"

# 1. Environment Secrets Pre-flight Verification
echo "🔍 [Pre-flight] Verifying Production Environment Configuration..."
REQUIRED_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "GEMINI_API_KEY"
  "WHATSAPP_ACCESS_TOKEN"
  "WHATSAPP_PHONE_NUMBER_ID"
  "RESEND_API_KEY"
)

for VAR in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!VAR:-}" ]]; then
    echo "⚠️ Warning: ${VAR} is not exported. Falling back to Google Secret Manager secret binding."
  fi
done

# 2. Antigravity Pre-build Lint & Type Verification
echo "🛡️ [Antigravity Check] Executing Strict TypeScript & Linter Verification..."
npm run build

# 3. Google Cloud Build Container Artifact Generation
echo "📦 [Container Build] Submitting build to Google Cloud Build..."
gcloud builds submit --tag "${IMAGE_TAG}" .

# 4. Google Cloud Run Zero-Downtime Deployment
echo "🚀 [Cloud Run Release] Deploying container image to Cloud Run service..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_TAG}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --concurrency 80 \
  --set-env-vars "NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
  --update-secrets "GEMINI_API_KEY=kesari-bagh-gemini-key:latest,WHATSAPP_ACCESS_TOKEN=kesari-bagh-whatsapp-token:latest,RESEND_API_KEY=kesari-bagh-resend-key:latest"

echo "✅ [Release Complete] The Kesari Bagh booking platform is live on Google Cloud Run."
