#!/bin/bash

# Petal Care Angular EC2 Deployment Script
# This script helps deploy the Angular application to EC2

echo "🚀 Starting Petal Care Angular Deployment to EC2..."

# Step 1: Build the production version
echo "📦 Building production version..."
npm run build -- --configuration=production

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Step 2: Check if dist folder exists
if [ ! -d "dist/petal-care-angular" ]; then
    echo "❌ dist/petal-care-angular folder not found!"
    exit 1
fi

echo "📁 Production build is ready in dist/petal-care-angular/"
echo ""
echo "🔧 Next steps for EC2 deployment:"
echo "1. Upload the dist/petal-care-angular folder to your EC2 instance"
echo "2. Install and configure a web server (nginx/apache) on EC2"
echo "3. Configure the web server to serve the Angular app"
echo "4. Set up SSL certificate if needed"
echo ""
echo "📋 Manual deployment commands:"
echo "# On your EC2 instance, install nginx:"
echo "sudo apt update"
echo "sudo apt install nginx"
echo ""
echo "# Copy your dist folder to nginx directory:"
echo "sudo cp -r dist/petal-care-angular/* /var/www/html/"
echo ""
echo "# Configure nginx (create /etc/nginx/sites-available/petal-care):"
echo "server {"
echo "    listen 80;"
echo "    server_name your-domain.com;"
echo "    root /var/www/html;"
echo "    index index.html;"
echo "    location / {"
echo "        try_files \$uri \$uri/ /index.html;"
echo "    }"
echo "}"
echo ""
echo "# Enable the site:"
echo "sudo ln -s /etc/nginx/sites-available/petal-care /etc/nginx/sites-enabled/"
echo "sudo nginx -t"
echo "sudo systemctl restart nginx"
echo ""
echo "🎉 Deployment script completed!" 