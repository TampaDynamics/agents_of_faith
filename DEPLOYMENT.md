# AWS Amplify Deployment Guide

This guide will help you deploy the Agents of Faith application to AWS Amplify.

## Prerequisites

1. AWS Account with appropriate permissions
2. GitHub repository with your code
3. OpenAI API key
4. Admin secret for the reindex endpoint

## Step 1: Prepare Your Repository

Ensure your repository has the following files:
- `package.json` with all dependencies
- `next.config.js` with production optimizations
- `amplify.yml` for build configuration
- `tsconfig.json` with latest TypeScript settings

## Step 2: Connect to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Choose your Git provider (GitHub, Bitbucket, etc.)
4. Connect your repository
5. Select the branch you want to deploy (usually `main` or `master`)

## Step 3: Configure Build Settings

The `amplify.yml` file is already configured, but you can customize it in the Amplify Console:

- **Build commands**: `npm ci && npm run build`
- **Output directory**: `.next`
- **Node.js version**: 18.x or 20.x (recommended)

## Step 4: Set Environment Variables

In the Amplify Console, go to "Environment variables" and add:

### Required Variables:
```
OPENAI_API_KEY=your_openai_api_key_here
ADMIN_SECRET=your_admin_secret_here
```

### Optional Variables:
```
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
VECTOR_STORE=memory
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=your_amplify_app_url
```

## Step 5: Deploy

1. Click "Save and deploy"
2. Amplify will automatically build and deploy your app
3. Monitor the build process in the console
4. Your app will be available at the provided Amplify URL

## Step 6: Custom Domain (Optional)

1. Go to "Domain management" in your app
2. Add your custom domain
3. Configure DNS settings as instructed
4. Wait for SSL certificate provisioning

## Environment-Specific Configurations

### Development
- Use `.env.local` for local development
- Set `NODE_ENV=development`

### Production
- Use Amplify environment variables
- Set `NODE_ENV=production`
- Ensure all API keys are properly configured

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Check for TypeScript compilation errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no extra spaces or quotes

3. **API Errors**
   - Verify OpenAI API key is valid
   - Check API rate limits
   - Ensure proper CORS configuration

### Build Commands:

```bash
# Local testing
npm run build
npm run start

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Security Considerations

1. **API Keys**: Never commit API keys to your repository
2. **Environment Variables**: Use Amplify's secure environment variable storage
3. **Admin Endpoints**: Ensure admin endpoints are properly secured
4. **CORS**: Configure CORS appropriately for production

## Performance Optimization

The app is configured with:
- Next.js standalone output
- Image optimization
- SWC minification
- Package import optimization
- Compression enabled

## Monitoring

1. **Amplify Console**: Monitor builds, deployments, and performance
2. **CloudWatch**: Set up logging and monitoring
3. **Application Insights**: Monitor API performance and errors

## Support

For issues with:
- **AWS Amplify**: Check [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **Application Logic**: Check the application logs in Amplify Console
