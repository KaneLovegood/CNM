# Hướng dẫn làm S3 Bucket Public để hiển thị ảnh

## Vấn đề: Ảnh không hiển thị dù đã upload lên S3 thành công

**Nguyên nhân:** S3 bucket mặc định là **private**, trình duyệt không thể truy cập trực tiếp URL ảnh.

---

## Cách sửa: Làm Public S3 Bucket

### Bước 1: Vào AWS Console → S3

1. Chọn bucket của bạn (ví dụ: `lab04`)
2. Vào tab **Permissions**

### Bước 2: Tắt "Block public access"

1. Click **Edit** ở phần **Block public access (bucket settings)**
2. **Bỏ chọn** tất cả các checkbox:
   - ☐ Block all public access
   - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through new public bucket or access point policies
   - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
3. Click **Save changes**
4. Xác nhận bằng cách gõ `confirm`

### Bước 3: Thêm Bucket Policy

1. Vẫn ở tab **Permissions**
2. Scroll xuống phần **Bucket policy**
3. Click **Edit**
4. Dán policy sau (thay `lab04` bằng tên bucket của bạn):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lab04/*"
    }
  ]
}
```

5. Click **Save changes**

---

## Kiểm tra

1. Upload ảnh lên S3 qua ứng dụng
2. Copy URL từ DynamoDB (field `url_image`)
3. Paste vào trình duyệt → Nếu thấy ảnh → **Thành công!**

---

## Lưu ý bảo mật

⚠️ **Làm public bucket có nghĩa là:**
- Bất kỳ ai có URL đều có thể xem ảnh
- Không phù hợp cho dữ liệu nhạy cảm

✅ **Cho lab/development:** OK
❌ **Cho production:** Nên dùng **CloudFront** hoặc **Signed URL** thay vì public bucket

---

## Cách khác: Dùng CloudFront (nâng cao)

Nếu muốn bảo mật hơn, có thể:
1. Giữ bucket private
2. Tạo CloudFront Distribution
3. Dùng CloudFront URL thay vì S3 URL trực tiếp

Nhưng cho lab thì làm public bucket là đủ rồi!
