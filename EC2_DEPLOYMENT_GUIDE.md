# Petal Care Angular - EC2 Deployment Guide

## Prerequisites
- EC2 instance running Ubuntu/Debian
- SSH access to your EC2 instance
- Domain name (optional but recommended)

## Step 1: Build Your Application Locally

```bash
# Run the deployment script
./deploy.sh
```

This will create a production build in `dist/petal-care-angular/`

## Step 2: Upload Files to EC2

### Option A: Using SCP
```bash
# Upload the dist folder to your EC2 instance
scp -i your-key.pem -r dist/petal-care-angular/* ubuntu@your-ec2-ip:/home/ubuntu/
```

### Option B: Using AWS CLI
```bash
# If you have AWS CLI configured
aws s3 cp dist/petal-care-angular s3://your-bucket/ --recursive
# Then download on EC2 from S3
```

## Step 3: Set Up Web Server on EC2

### Install Nginx
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update
sudo apt upgrade -y

# Install nginx
sudo apt install nginx -y

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx
```bash
# Copy your built files to nginx directory
sudo cp -r /home/ubuntu/* /var/www/html/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# Create nginx configuration
sudo nano /etc/nginx/sites-available/petal-care
```

Copy the contents of `nginx-config.conf` into the file, then:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/petal-care /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Step 4: Configure Security Groups

In AWS Console:
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Add inbound rules:
   - HTTP (Port 80) - Source: 0.0.0.0/0
   - HTTPS (Port 443) - Source: 0.0.0.0/0 (if using SSL)

## Step 5: Set Up SSL (Optional but Recommended)

### Using Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 6: Environment Configuration

Make sure your `environment.prod.ts` has the correct API URLs:

```typescript
export const environment = {
  production: true,
  api: {
    baseUrl: 'https://your-api-domain.com', // Update this
    endpoints: {
      // ... your endpoints
    }
  },
  firebase: {
    // ... your Firebase config
  }
};
```

## Step 7: Test Your Deployment

1. Visit your EC2 public IP or domain in a browser
2. Test all major functionality
3. Check browser console for any errors
4. Verify API calls are working

## Troubleshooting

### Common Issues:

1. **404 Errors on Refresh**: Make sure nginx has the `try_files` directive
2. **API Calls Failing**: Check CORS settings on your backend
3. **Assets Not Loading**: Verify file permissions in `/var/www/html/`
4. **SSL Issues**: Check certificate installation and nginx configuration

### Useful Commands:
```bash
# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Check nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Automation Script

For future deployments, you can create an automated script:

```bash
#!/bin/bash
# deploy-to-ec2.sh

# Build the application
npm run build -- --configuration=production

# Upload to EC2
scp -i your-key.pem -r dist/petal-care-angular/* ubuntu@your-ec2-ip:/home/ubuntu/

# Execute deployment commands on EC2
ssh -i your-key.pem ubuntu@your-ec2-ip << 'EOF'
sudo cp -r /home/ubuntu/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
sudo systemctl restart nginx
echo "Deployment completed!"
EOF
```

## Performance Optimization

1. **Enable Gzip Compression**: Already included in nginx config
2. **Browser Caching**: Already configured for static assets
3. **CDN**: Consider using CloudFront for global distribution
4. **Load Balancer**: For high traffic, use Application Load Balancer

## Monitoring

Set up monitoring for your application:
- CloudWatch for EC2 metrics
- Application monitoring (New Relic, DataDog, etc.)
- Uptime monitoring (Pingdom, UptimeRobot)

---

**Note**: Replace `your-ec2-ip`, `your-domain.com`, `your-key.pem`, and `your-api-domain.com` with your actual values. 