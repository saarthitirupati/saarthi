# Deployment

Saarthi is optimized for deployment on Vercel.

## Vercel Deployment

1.  Connect your GitHub repository to Vercel.
2.  Configure the build command: `npm run build`
3.  Configure the output directory: `.next`
4.  Add the required environment variables:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `DATABASE_URL`

Ensure that you deploy from the stable main branch and pass all CI checks (`npm run verify`) before merging.
