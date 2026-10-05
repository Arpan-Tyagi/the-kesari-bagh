# Google Antigravity Agent Configuration & MCP Tooling Rules
# Project: The Kesari Bagh (Ultra-Luxury French-Colonial Countryside Estate)

## 1. Antigravity MCP Server Integrations
This project utilizes the following Model Context Protocol (MCP) servers:

- **Google Cloud Run MCP (`google.cloud.run`)**:
  - Automates container workload deployments to managed Cloud Run services.
  - Controls traffic splitting, revision tags, minimum instances, and CPU throttling.
  - Automatically registers health check probes against `/api/health`.

- **Gemini Cloud Assist MCP (`google.gemini.assist`)**:
  - Provides architecture diagnostics, latency tracing, and container memory profiling.
  - Validates Secret Manager bindings for `GEMINI_API_KEY`, `WHATSAPP_ACCESS_TOKEN`, and `RESEND_API_KEY`.

- **App Design Center MCP (`google.antigravity.design_center`)**:
  - Enforces design token fidelity (#FBF9F5 Warm Alabaster, #142019 Deep Cypress, #C5A880 Polished Brass).
  - Validates typography scales (Cormorant Garamond, Plus Jakarta Sans, JetBrains Mono).
  - Monitors layout performance and viewport stability (`min-h-[100dvh]` on mobile viewports).

## 2. Antigravity CLI (`agy`) Workflow Standards
1. **Pre-flight Check**: Run `agy check` to verify TypeScript strictness and lint rules before commit.
2. **Secret Synchronization**: Ensure zero plain-text secrets in git. Synchronize all environment keys via Google Secret Manager.
3. **Container Pipeline**: Trigger automated builds with `agy deploy --target=cloud-run` executing `deploy.sh`.
4. **Idempotency & Concurrency**:
   - Webhooks at `/api/webhooks/whatsapp` must ACK with HTTP 200 within 3 seconds.
   - Postgres exclusion constraints enforce date uniqueness (`daterange(check_in, check_out, '[)') WITH &&`).
