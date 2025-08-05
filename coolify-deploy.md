# WordSync - Coolify Deployment Guide

## 🚀 Quick Deploy to Coolify

### 1. Repository Setup

**GitHub Repository:**

```bash
git add .
git commit -m "Add Docker deployment configuration"
git push origin main
```

### 2. Coolify Configuration

**Application Settings:**

- **Build Pack**: `Docker`
- **Port**: `3000`
- **Dockerfile Path**: `./Dockerfile`
- **Build Command**: `docker build -t wordsync .`

**Environment Variables:**

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
```

### 3. Domain Configuration

**Custom Domain (Optional):**

```
your-domain.com
```

**Health Check:**

```
Path: /
Expected Status: 200
```

---

## 🏗️ Build Process

### Docker Build Stages

1. **Dependencies**: Install production dependencies only
2. **Builder**: Build Next.js application with optimizations
3. **Runner**: Create lightweight production image

### Build Optimizations

- ✅ **Multi-stage build** for smaller image size
- ✅ **Standalone output** for faster startup
- ✅ **Node.js 18 Alpine** for security and size
- ✅ **Non-root user** for security
- ✅ **Production optimizations** enabled

---

## 🌐 Live URL Structure

### Game Access URLs

**Role Selection:**

```
https://your-app.coolify.com/
```

**Direct Tutor Access:**

```
https://your-app.coolify.com/?role=tutor
```

**Direct Student Access:**

```
https://your-app.coolify.com/?role=student
```

**Session Joining:**

```
https://your-app.coolify.com/?role=student&session=abc123
```

**Iframe Embedding:**

```
https://your-app.coolify.com/game?role=tutor&session=abc123
```

---

## 📊 Performance

### Expected Performance

- **Cold Start**: < 3 seconds
- **Memory Usage**: ~100MB
- **Image Size**: ~200MB (optimized)
- **Build Time**: ~2-3 minutes

### Scaling

- **Horizontal Scaling**: ✅ Supported
- **Load Balancer**: ✅ Compatible
- **Session Persistence**: Uses localStorage (client-side)
- **WebSocket**: BroadcastChannel API (client-side)

---

## 🔧 Local Testing

### Test Docker Build Locally

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run

# Test the application
curl http://localhost:3000
```

### Verify Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🚨 Troubleshooting

### Common Issues

**Build Fails:**

```bash
# Check dependencies
npm install
npm run build
```

**Container Won't Start:**

```bash
# Check logs in Coolify dashboard
# Verify environment variables
# Check port 3000 is not blocked
```

**Session Sync Issues:**

```bash
# Ensure HTTPS is enabled for production
# Check browser console for errors
# Verify localStorage is working
```

### Health Check Endpoints

**Application Status:**

```
GET /
Returns: WordSync homepage (200 OK)
```

**API Health:**

```
GET /api/health (if implemented)
Returns: {"status": "ok"}
```

---

## 🎯 Deployment Checklist

- [ ] ✅ Repository pushed to GitHub
- [ ] ✅ Dockerfile created and tested
- [ ] ✅ Environment variables configured
- [ ] ✅ Coolify application created
- [ ] ✅ Domain configured (optional)
- [ ] ✅ SSL certificate enabled
- [ ] ✅ Health checks passing
- [ ] ✅ Game functionality tested

---

## 🎮 Post-Deployment Testing

### Test Game Flow

1. **Create Session**: Visit as tutor, create game
2. **Join Session**: Open shared link as student
3. **Play Game**: Test word progression and scoring
4. **Cross-Tab Sync**: Verify real-time synchronization
5. **Iframe Embed**: Test `/game` route for embedding

### Verify Features

- [ ] ✅ Role-based word hiding (tutors see `???`)
- [ ] ✅ Real-time chat synchronization
- [ ] ✅ Score tracking and progression
- [ ] ✅ Word changes sync across tabs
- [ ] ✅ Session persistence across refreshes
- [ ] ✅ Mobile-responsive design

---

## 📈 Monitoring

### Key Metrics to Watch

- **Response Time**: < 500ms
- **Error Rate**: < 1%
- **Memory Usage**: < 200MB
- **CPU Usage**: < 50%

### Logs to Monitor

- Application startup logs
- Session creation/join events
- WebSocket connection status
- Any JavaScript errors in browser console

---

**Ready to deploy! 🚀 Your WordSync game will be live on Coolify in minutes!**
