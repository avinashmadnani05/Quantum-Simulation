# 🚀 Deployment Guide for Render.com

## Backend Deployment (FastAPI)

### 1. Prepare for Deployment

1. **Update requirements.txt**:
   ```bash
   cp requirements-optimized.txt requirements.txt
   ```

2. **Create render.yaml** (optional):
   ```yaml
   services:
     - type: web
       name: quantum-physics-api
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: python main.py
       envVars:
         - key: PORT
           value: 8000
   ```

### 2. Deploy to Render.com

1. **Connect Repository**:
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Settings**:
   - **Name**: `quantum-physics-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Instance Type**: `Free` (or upgrade for better performance)

3. **Environment Variables** (if needed):
   - `PORT`: `8000`
   - `WORKERS`: `1` (for free tier)

### 3. Optimize for Free Tier

The backend is optimized for free hosting:
- ✅ **Caching**: LRU cache for calculations
- ✅ **Compression**: GZip middleware
- ✅ **Memory efficient**: Optimized matplotlib settings
- ✅ **Fast startup**: Pre-initialized components
- ✅ **Error handling**: Proper HTTP status codes

## Frontend Deployment (Vite)

### 1. Build for Production

```bash
cd simulation-vite
npm run build
```

### 2. Deploy to Vercel/Netlify

#### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

#### Netlify
1. Build the project: `npm run build`
2. Upload `dist/` folder to Netlify
3. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

### 3. Update API URL

In `simulation-vite/src/api/physicsApi.js`:
```javascript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## Performance Optimizations

### Backend Optimizations
- **Caching**: LRU cache for repeated calculations
- **Compression**: GZip middleware for faster responses
- **Memory**: Optimized matplotlib for server environment
- **Startup**: Pre-initialized quantum simulator
- **Error Handling**: Proper HTTP status codes

### Frontend Optimizations
- **Vite**: Lightning-fast builds
- **Code Splitting**: Lazy loading of components
- **3D Optimization**: Efficient Three.js rendering
- **Caching**: Local storage for results
- **Compression**: Optimized assets

## Monitoring & Maintenance

### Health Checks
- **Backend**: `GET /health` - Lightweight health check
- **Stats**: `GET /stats` - API statistics
- **Cache**: `POST /clear_cache` - Clear caches

### Performance Monitoring
- Monitor response times on Render dashboard
- Check memory usage
- Monitor cache hit rates
- Set up alerts for downtime

## Troubleshooting

### Common Issues

1. **Slow Responses**:
   - Check cache hit rates
   - Monitor memory usage
   - Consider upgrading Render plan

2. **Memory Issues**:
   - Clear caches periodically
   - Monitor matplotlib memory usage
   - Restart service if needed

3. **CORS Issues**:
   - Update allowed origins in main.py
   - Check frontend URL configuration

### Debug Commands

```bash
# Check backend health
curl https://your-api.onrender.com/health

# Check stats
curl https://your-api.onrender.com/stats

# Clear cache
curl -X POST https://your-api.onrender.com/clear_cache
```

## Cost Optimization

### Free Tier Limits
- **Render**: 750 hours/month
- **Vercel**: 100GB bandwidth/month
- **Memory**: 512MB RAM

### Optimization Tips
1. **Use caching** to reduce calculations
2. **Optimize images** and assets
3. **Monitor usage** regularly
4. **Consider paid plans** for production

## Security Considerations

1. **API Rate Limiting**: Consider adding rate limiting
2. **Input Validation**: All inputs are validated
3. **Error Handling**: No sensitive data in errors
4. **CORS**: Properly configured for production

## Scaling Considerations

### When to Upgrade
- **High traffic**: >1000 requests/day
- **Memory issues**: Frequent crashes
- **Slow responses**: >5s average
- **Business critical**: Production use

### Upgrade Path
1. **Render**: Free → Starter ($7/month)
2. **Vercel**: Free → Pro ($20/month)
3. **Database**: Add PostgreSQL for data persistence
4. **CDN**: Add CloudFlare for global distribution

---

## 🎉 Deployment Complete!

Your Quantum Physics Lab is now ready for production with:
- ✅ **Optimized backend** for free hosting
- ✅ **Modern frontend** with 3D visualizations
- ✅ **Legacy simulation** option
- ✅ **Performance monitoring**
- ✅ **Scalable architecture**

**Live URLs**:
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`
