# AWS Amplify Deployment Checklist

## Pre-Deployment

- [ ] All dependencies updated to latest versions
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Environment variables documented
- [ ] AWS Amplify configuration file created (`amplify.yml`)

## Environment Variables to Set in Amplify Console

### Required
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `ADMIN_SECRET` - Secret for admin endpoints

### Optional
- [ ] `OPENAI_BASE_URL` - OpenAI API base URL (default: https://api.openai.com/v1)
- [ ] `OPENAI_MODEL` - Model to use (default: gpt-4o)
- [ ] `VECTOR_STORE` - Vector store type (default: memory)
- [ ] `NEXT_PUBLIC_APP_ENV` - Environment indicator (default: production)

## Build Configuration

- [ ] Node.js version: 18.x or 20.x
- [ ] Build command: `npm ci && npm run build`
- [ ] Output directory: `.next`
- [ ] Install command: `npm ci`

## Post-Deployment

- [ ] Application loads without errors
- [ ] API endpoints respond correctly
- [ ] Environment variables accessible
- [ ] Static assets load properly
- [ ] Custom domain configured (if applicable)

## Troubleshooting

### Common Issues
- [ ] Build failures due to TypeScript errors
- [ ] Environment variables not accessible
- [ ] API rate limits exceeded
- [ ] CORS issues with external APIs

### Solutions
- [ ] Check build logs in Amplify Console
- [ ] Verify environment variable names match exactly
- [ ] Monitor OpenAI API usage
- [ ] Test API endpoints locally first

## Monitoring

- [ ] Amplify Console build monitoring enabled
- [ ] CloudWatch logging configured
- [ ] Performance metrics tracked
- [ ] Error alerts set up
