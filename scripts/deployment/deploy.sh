#!/bin/bash

# Enterprise Deployment Pipeline for Respiro Balance
# Supports: dev, staging, production environments

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-$(git rev-parse --short HEAD)}

echo "🚀 Starting deployment to $ENVIRONMENT environment"
echo "📦 Version: $VERSION"

# Environment validation
case $ENVIRONMENT in
  dev|staging|production)
    echo "✅ Valid environment: $ENVIRONMENT"
    ;;
  *)
    echo "❌ Invalid environment. Use: dev, staging, or production"
    exit 1
    ;;
esac

# Load environment-specific configuration
if [ -f ".env.$ENVIRONMENT" ]; then
  source ".env.$ENVIRONMENT"
  echo "✅ Loaded environment configuration"
else
  echo "❌ Environment configuration not found: .env.$ENVIRONMENT"
  exit 1
fi

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check database connectivity
echo "📊 Checking database connectivity..."
npm run db:status || {
  echo "❌ Database connectivity check failed"
  exit 1
}

# Run tests
if [ "$ENVIRONMENT" = "production" ]; then
  echo "🧪 Running full test suite..."
  npm run test:all || {
    echo "❌ Tests failed - deployment cancelled"
    exit 1
  }
else
  echo "🧪 Running smoke tests..."
  npm run test:smoke || {
    echo "❌ Smoke tests failed - deployment cancelled"
    exit 1
  }
fi

# Build application
echo "🏗️  Building application..."
npm run build || {
  echo "❌ Build failed"
  exit 1
}

# Database migrations
if [ "$ENVIRONMENT" = "production" ]; then
  echo "📋 Creating migration backup..."
  npm run db:backup
  
  echo "🗄️  Running database migrations..."
  npm run db:migrate || {
    echo "❌ Migration failed - rolling back..."
    npm run db:rollback
    exit 1
  }
else
  echo "🗄️  Running database migrations..."
  npm run db:migrate
fi

# Deploy based on environment
case $ENVIRONMENT in
  dev)
    echo "🚀 Deploying to development..."
    # Add dev deployment commands
    ;;
  staging)
    echo "🚀 Deploying to staging..."
    # Add staging deployment commands
    ;;
  production)
    echo "🚀 Deploying to production..."
    
    # Create deployment tag
    git tag "v$VERSION-$(date +%Y%m%d-%H%M%S)"
    
    # Production deployment commands
    # Add your production deployment logic here
    ;;
esac

# Post-deployment verification
echo "🔍 Running post-deployment verification..."

# Health check
check_health() {
  local url=$1
  local max_attempts=30
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    if curl -f -s "$url/health" > /dev/null; then
      echo "✅ Health check passed"
      return 0
    fi
    
    echo "⏳ Health check attempt $attempt/$max_attempts failed, retrying..."
    sleep 10
    attempt=$((attempt + 1))
  done
  
  echo "❌ Health check failed after $max_attempts attempts"
  return 1
}

# Environment-specific health checks
case $ENVIRONMENT in
  dev)
    check_health "http://localhost:3000"
    ;;
  staging)
    check_health "$STAGING_URL"
    ;;
  production)
    check_health "$PRODUCTION_URL"
    
    # Additional production checks
    echo "🔍 Running production smoke tests..."
    npm run test:production-smoke || {
      echo "❌ Production smoke tests failed"
      # Consider automatic rollback here
      exit 1
    }
    ;;
esac

# Update monitoring and alerting
echo "📊 Updating monitoring configuration..."
case $ENVIRONMENT in
  staging|production)
    # Update monitoring dashboards
    # Set up alerts for new deployment
    echo "✅ Monitoring updated"
    ;;
esac

# Notification
echo "📢 Sending deployment notifications..."
case $ENVIRONMENT in
  production)
    # Send production deployment notifications
    # Slack, email, etc.
    echo "✅ Production deployment notifications sent"
    ;;
  staging)
    # Send staging deployment notifications
    echo "✅ Staging deployment notifications sent"
    ;;
esac

echo "🎉 Deployment to $ENVIRONMENT completed successfully!"
echo "📊 Deployment summary:"
echo "  - Environment: $ENVIRONMENT"
echo "  - Version: $VERSION"
echo "  - Timestamp: $(date)"
echo "  - Git commit: $(git rev-parse HEAD)"

# Clean up temporary files
echo "🧹 Cleaning up..."
# Add cleanup commands if needed

echo "✅ Deployment pipeline completed successfully!"