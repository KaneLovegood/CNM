# Hướng dẫn kiểm tra và sửa lỗi DynamoDB "Missing the key id"

## Lỗi: "ValidationException: Missing the key id in the item"

Lỗi này xảy ra khi **tên primary key** trong DynamoDB table **không khớp** với tên trong code.

---

## Cách kiểm tra và sửa:

### 1. Kiểm tra Primary Key trong DynamoDB Table

Vào **AWS Console** → **DynamoDB** → **Tables** → chọn table của bạn:

#### Bảng `Products`:
- **Primary key** phải là: `id` (String)
- Nếu là `productId` hoặc tên khác → **PHẢI SỬA CODE** hoặc **TẠO LẠI TABLE**

#### Bảng `Categories`:
- **Primary key** phải là: `categoryId` (String)

#### Bảng `Users`:
- **Primary key** phải là: `userId` (String)

#### Bảng `ProductLogs`:
- **Primary key** phải là: `logId` (String)

---

### 2. Nếu Primary Key không đúng - Có 2 cách:

#### Cách 1: Sửa code cho khớp với DynamoDB (nếu table đã có dữ liệu)

Ví dụ: Nếu table `Products` có primary key là `productId`:

```js
// product.repo.js
async function createProduct(data) {
  const item = {
    productId: uuidv4(),  // Đổi từ id sang productId
    ...data,
    isDeleted: false,
    createdAt: new Date().toISOString(),
  };
  await dynamodb.put({ TableName: TABLE, Item: item }).promise();
  return item;
}

async function getById(id) {
  const data = await dynamodb
    .get({ TableName: TABLE, Key: { productId: id } })  // Đổi từ id sang productId
    .promise();
  return data.Item;
}
```

#### Cách 2: Tạo lại table với đúng tên primary key (khuyến nghị)

1. Xóa table cũ (nếu không có dữ liệu quan trọng)
2. Tạo table mới với đúng tên primary key:
   - `Products`: Primary key = `id` (String)
   - `Categories`: Primary key = `categoryId` (String)
   - `Users`: Primary key = `userId` (String)
   - `ProductLogs`: Primary key = `logId` (String)

---

### 3. Kiểm tra tên bảng trong .env

File `.env` phải có:
```env
DYNAMODB_TABLE_PRODUCTS=Products
DYNAMODB_TABLE_USERS=Users
DYNAMODB_TABLE_CATEGORIES=Categories
DYNAMODB_TABLE_LOGS=ProductLogs
```

**Lưu ý:** Tên trong `.env` phải **khớp chính xác** với tên table trong DynamoDB (phân biệt hoa thường).

---

### 4. Debug với console.log

Sau khi sửa, chạy lại ứng dụng và xem log:
- Item có đúng primary key không?
- Tên table có đúng không?

Nếu vẫn lỗi, copy log và kiểm tra lại.

---

## Checklist nhanh:

- [ ] Table `Products` có primary key = `id`?
- [ ] Table `Categories` có primary key = `categoryId`?
- [ ] Table `Users` có primary key = `userId`?
- [ ] Table `ProductLogs` có primary key = `logId`?
- [ ] Tên table trong `.env` khớp với tên trong DynamoDB?
- [ ] Code repository dùng đúng tên primary key?
