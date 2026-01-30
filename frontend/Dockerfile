# Stage 1: Dependencies
FROM node:20-alpine AS deps
# libc6-compat ki zaroorat Next.js ko Alpine par parti hai
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Sirf package.json copy kar rahe hain taake lock-file ka error na aaye
COPY package.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variable for build time (if needed)
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Stage 3: Runner (Final Image)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Security ke liye non-root user create karna
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public folder aur static files copy karein
# COPY --from=builder /app/public ./public
# Standalone output (next.config.js mein 'standalone' hona zaroori hai)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js standalone build ka default entry point hai
CMD ["node", "server.js"]