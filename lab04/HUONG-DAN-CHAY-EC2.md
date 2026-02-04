# Hướng dẫn chạy ứng dụng trên EC2

## Bước 1: Copy code lên EC2 (từ máy Windows)

### Cách 1: Dùng script PowerShell (khuyến nghị)
```powershell
cd D:\HOC\NAM4\CNM\lab04
.\deploy-to-ec2.ps1 -EC2IP "98.93.62.6"
```

### Cách 2: Dùng SCP thủ công
```powershell
cd D:\HOC\NAM4\CNM\lab04\src
scp -i "lab044.pem" -r * ec2-user@98.93.62.6:~/lab04/src/
```

---

## Bước 2: SSH vào EC2 và setup

```powershell
# SSH vào EC2
cd D:\HOC\NAM4\CNM\lab04\src
ssh -i "lab044.pem" ec2-user@98.93.62.6
```

Sau khi vào EC2, chạy các lệnh sau:

### 2.1. Cài đặt Node.js (nếu chưa có)
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
node --version  # Kiểm tra version
```

### 2.2. Di chuyển vào thư mục project
```bash
cd ~/lab04/src
```

### 2.3. Cài đặt dependencies
```bash
npm install
```

### 2.4. Tạo file .env (QUAN TRỌNG: KHÔNG có access key!)
```bash
cat > .env << EOF
AWS_REGION=us-east-1
DYNAMODB_TABLE_PRODUCTS=Products
DYNAMODB_TABLE_USERS=Users
DYNAMODB_TABLE_CATEGORIES=Categories
DYNAMODB_TABLE_LOGS=ProductLogs
S3_BUCKET_NAME=lab04
PORT=3000
EOF
```

**LƯU Ý:** Trên EC2 với IAM Role, bạn **KHÔNG CẦN** `AWS_ACCESS_KEY_ID` và `AWS_SECRET_ACCESS_KEY` trong `.env`!

### 2.5. Kiểm tra IAM Role (quan trọng!)
```bash
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
```
Nếu có output tên role → OK. Nếu lỗi → cần gán IAM Role cho EC2.

---

## Bước 3: Chạy ứng dụng

### Cách 1: Chạy trực tiếp (để test)
```bash
npm start
```
Ứng dụng sẽ chạy trên port 3000.

### Cách 2: Chạy nền với PM2 (khuyến nghị cho production)
```bash
# Cài PM2
sudo npm install -g pm2

# Chạy ứng dụng
pm2 start app.js --name lab04

# Xem log
pm2 logs lab04

# Xem trạng thái
pm2 status

# Dừng ứng dụng
pm2 stop lab04

# Khởi động lại khi reboot
pm2 startup
pm2 save
```

---

## Bước 4: Mở port trong Security Group

1. Vào **AWS Console** → **EC2** → **Security Groups**
2. Chọn Security Group của EC2 instance
3. **Inbound rules** → **Edit inbound rules**
4. Thêm rule:
   - **Type:** Custom TCP
   - **Port:** 3000
   - **Source:** 0.0.0.0/0 (hoặc IP của bạn)
   - **Description:** Lab04 Node.js app

---

## Bước 5: Truy cập ứng dụng

Mở trình duyệt:
```
http://YOUR_EC2_PUBLIC_IP:3000
```

Ví dụ:
```
http://98.93.62.6:3000
```

---

## Kiểm tra lỗi thường gặp

### Lỗi: "Missing credentials"
→ Kiểm tra IAM Role đã được gán cho EC2 chưa

### Lỗi: "Cannot connect to EC2"
→ Kiểm tra Security Group đã mở port 3000 chưa

### Lỗi: "Table not found"
→ Kiểm tra tên bảng DynamoDB trong `.env` đúng chưa

---

## Tạo dữ liệu mẫu (nếu cần)

Sau khi chạy ứng dụng, bạn có thể:
1. Tạo user admin đầu tiên bằng code (seed script)
2. Tạo categories mẫu
3. Đăng nhập và test các chức năng
