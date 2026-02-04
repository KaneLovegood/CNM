#!/bin/bash
# Script setup và chạy ứng dụng trên EC2
# Chạy sau khi đã copy code lên EC2

echo "=== Bắt đầu setup ứng dụng trên EC2 ==="

# 1. Cài đặt Node.js (nếu chưa có)
if ! command -v node &> /dev/null; then
    echo "Đang cài đặt Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
else
    echo "Node.js đã được cài đặt: $(node --version)"
fi

# 2. Di chuyển vào thư mục project
cd ~/lab04/src

# 3. Cài đặt dependencies
echo "Đang cài đặt dependencies..."
npm install

# 4. Tạo file .env (KHÔNG có access key vì dùng IAM Role)
echo "Đang tạo file .env..."
cat > .env << EOF
AWS_REGION=us-east-1
DYNAMODB_TABLE_PRODUCTS=Products
DYNAMODB_TABLE_USERS=Users
DYNAMODB_TABLE_CATEGORIES=Categories
DYNAMODB_TABLE_LOGS=ProductLogs
S3_BUCKET_NAME=lab04
PORT=3000
EOF

echo "File .env đã được tạo (KHÔNG có access key - dùng IAM Role)"

# 5. Kiểm tra IAM Role
echo ""
echo "=== Kiểm tra IAM Role ==="
curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/ || echo "Chưa có IAM Role được gán cho EC2!"

# 6. Chạy ứng dụng
echo ""
echo "=== Khởi động ứng dụng ==="
echo "Chạy: npm start"
echo "Hoặc dùng PM2 để chạy nền: npm install -g pm2 && pm2 start app.js --name lab04"
