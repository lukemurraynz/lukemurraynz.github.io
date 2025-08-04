# 🔒 SEO and Security Headers Configuration

This document provides recommendations for configuring security headers at the server/hosting level to improve SEO rankings and security posture.

## GitHub Pages Configuration

Since this site is hosted on GitHub Pages, security headers need to be configured through the hosting provider or CDN. Here are the recommended headers:

### Required Security Headers

Add these headers to your hosting configuration:

```
# Strict Transport Security (HSTS)
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com;

# X-Frame-Options
X-Frame-Options: DENY

# X-Content-Type-Options
X-Content-Type-Options: nosniff

# Referrer Policy
Referrer-Policy: strict-origin-when-cross-origin

# X-XSS-Protection
X-XSS-Protection: 1; mode=block
```

### Performance Headers

```
# Cache Control for static assets
Cache-Control: public, max-age=31536000, immutable

# Preload critical resources
Link: </static/css/main.css>; rel=preload; as=style
Link: </static/js/main.js>; rel=preload; as=script
```

## Cloudflare Configuration

If using Cloudflare as a CDN, you can add these headers via Page Rules or Workers:

### Page Rules Method

1. Go to Cloudflare Dashboard → Page Rules
2. Create a new rule for `luke.geek.nz/*`
3. Add the following settings:
   - Security Level: High
   - Cache Level: Standard
   - Browser Integrity Check: On
   - Always Use HTTPS: On

### Workers Method

Create a Cloudflare Worker with this script:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  
  // Add security headers
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  newResponse.headers.set('X-Frame-Options', 'DENY')
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')
  
  return newResponse
}
```

## Nginx Configuration

If self-hosting with Nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name luke.geek.nz;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # CSP header
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com;" always;
    
    # Cache headers for static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Verification

After implementing headers, verify them using:

### Online Tools
- [Security Headers](https://securityheaders.com/)
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [GTmetrix](https://gtmetrix.com/)

### Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Reload the page
4. Check response headers for the main document

### Command Line
```bash
curl -I https://luke.geek.nz
```

## SEO Benefits

These headers provide the following SEO benefits:

- **HSTS**: Ensures all traffic is encrypted, improving trust signals
- **CSP**: Prevents XSS attacks, improving security reputation
- **Cache Headers**: Improve page load speed, a ranking factor
- **Compression**: Reduces bandwidth usage and improves load times

## Performance Impact

- Security headers have minimal performance impact
- Proper caching can reduce server load by 50-80%
- Gzip compression typically reduces payload size by 60-70%

## Monitoring

Set up monitoring for:
- Header presence and correctness
- SSL certificate expiration
- Page load speed metrics
- Security header compliance scores