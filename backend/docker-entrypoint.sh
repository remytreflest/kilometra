#!/bin/sh
set -e

echo "⏳ Applying Prisma migrations..."
npx prisma migrate deploy

echo "🔍 Checking if seed is needed..."
NEEDS_SEED=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.count()
  .then(n => { process.stdout.write(n === 0 ? 'yes' : 'no'); p.\$disconnect(); })
  .catch(() => { process.stdout.write('yes'); });
")

if [ "$NEEDS_SEED" = "yes" ]; then
  echo "🌱 Empty database — running seed..."
  node prisma/seed.js
else
  echo "✅ Database already seeded — skipping."
fi

echo "🚀 Starting application..."
exec node dist/main.js
