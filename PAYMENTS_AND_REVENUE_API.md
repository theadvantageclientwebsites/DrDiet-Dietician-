# Payments & Revenue API

## Base URL

```text
https://dr-dietician-backend.onrender.com/api
```

---

# PART 1: PATIENT PAYMENTS

All payment endpoints require **Patient** authentication.

```http
Authorization: Bearer <patient_token>
Content-Type: application/json
```

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/patient/payments/create-order` | Create Razorpay order |
| `POST` | `/patient/payments/verify` | Verify payment after success |
| `GET` | `/patient/payments/my-orders` | My purchase history |

---

## 1) Create Order

### Endpoint

```http
POST /patient/payments/create-order
```

### Full URL

```text
https://dr-dietician-backend.onrender.com/api/patient/payments/create-order
```

### Request Body — Buy a Package

```json
{
  "itemType": "PACKAGE",
  "itemId": "package_id_here",
  "duration": "ONE_MONTH"
}
```

### Request Body — Buy a Digital Product

```json
{
  "itemType": "DIGITAL_PRODUCT",
  "itemId": "product_id_here"
}
```

### Field Notes

- `itemType` → `PACKAGE` | `DIGITAL_PRODUCT`
- `itemId` → ID of the package or digital product
- `duration` → Required only for PACKAGE: `ONE_MONTH` | `THREE_MONTHS` | `SIX_MONTHS`

### Success Response

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_QzXvYz123456",
    "amount": 129900,
    "currency": "INR",
    "keyId": "rzp_test_xxxxxxxxxxxx",
    "itemName": "Thyroid Management - 1 Month",
    "dbOrderId": "internal_order_id"
  }
}
```

### Important Notes

- `amount` is in **paise** (₹1 = 100 paise). ₹1,299 → 129900
- `keyId` is the Razorpay public key — use this to open the Razorpay popup
- `orderId` is the Razorpay order ID — use this in the Razorpay popup

---

## 2) Verify Payment

Call this **after** Razorpay popup closes successfully.

### Endpoint

```http
POST /patient/payments/verify
```

### Full URL

```text
https://dr-dietician-backend.onrender.com/api/patient/payments/verify
```

### Request Body

```json
{
  "razorpayOrderId": "order_QzXvYz123456",
  "razorpayPaymentId": "pay_QzXvYz789012",
  "razorpaySignature": "abc123def456..."
}
```

All three fields come directly from Razorpay's callback handler response.

### Success Response

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "success": true,
    "orderId": "internal_order_id",
    "itemType": "PACKAGE",
    "itemName": "Thyroid Management - 1 Month",
    "amount": 1299,
    "paidAt": "2026-07-19T10:00:00.000Z",
    "message": "Payment successful! You now have access to your purchase."
  }
}
```

### Error Responses

```json
{ "success": false, "message": "Payment verification failed. Invalid signature." }
{ "success": false, "message": "Order not found or already processed" }
{ "success": false, "message": "razorpayOrderId, razorpayPaymentId and razorpaySignature are required" }
```

---

## 3) My Orders (Purchase History)

### Endpoint

```http
GET /patient/payments/my-orders
```

### Full URL

```text
https://dr-dietician-backend.onrender.com/api/patient/payments/my-orders
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter by status |
| `itemType` | string | Filter by item type |

### Status Values

- `PENDING` — Order created but not paid yet
- `PAID` — Payment successful
- `FAILED` — Payment failed
- `REFUNDED` — Amount refunded

### Example URLs

```text
GET /patient/payments/my-orders
GET /patient/payments/my-orders?status=PAID
GET /patient/payments/my-orders?itemType=PACKAGE
GET /patient/payments/my-orders?status=PAID&itemType=DIGITAL_PRODUCT
```

### Success Response

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "items": [
      {
        "id": "order_id",
        "itemType": "PACKAGE",
        "itemId": "package_id",
        "itemName": "Thyroid Management - 1 Month",
        "amount": 1299,
        "currency": "INR",
        "duration": "ONE_MONTH",
        "status": "PAID",
        "razorpayOrderId": "order_QzXvYz123456",
        "razorpayPaymentId": "pay_QzXvYz789012",
        "paidAt": "2026-07-19T10:00:00.000Z",
        "createdAt": "2026-07-19T09:58:00.000Z"
      },
      {
        "id": "order_id_2",
        "itemType": "DIGITAL_PRODUCT",
        "itemId": "product_id",
        "itemName": "Thyroid Diet Guide",
        "amount": 299,
        "currency": "INR",
        "duration": null,
        "status": "PAID",
        "paidAt": "2026-07-18T00:00:00.000Z",
        "createdAt": "2026-07-18T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 5,
      "totalPages": 1
    }
  }
}
```

---

## Complete Frontend Integration Flow

### Step 1 — Add Razorpay Script

Add to your HTML `<head>`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 2 — Buy Package Example

```js
const buyPackage = async (packageId, duration) => {
  // Create order on backend
  const orderRes = await fetch(
    "https://dr-dietician-backend.onrender.com/api/patient/payments/create-order",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${patientToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemType: "PACKAGE",
        itemId: packageId,
        duration: duration, // "ONE_MONTH" | "THREE_MONTHS" | "SIX_MONTHS"
      }),
    }
  );

  const { data: orderData } = await orderRes.json();

  // Open Razorpay popup
  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.orderId,
    name: "DrDiet Therapy",
    description: orderData.itemName,
    handler: async (response) => {
      // Verify payment on backend
      const verifyRes = await fetch(
        "https://dr-dietician-backend.onrender.com/api/patient/payments/verify",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${patientToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        }
      );

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        alert("Payment successful! You now have access.");
        // Redirect or update UI
      }
    },
    prefill: {
      name: patientName,
      email: patientEmail,
    },
    theme: { color: "#0d9488" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

// Usage
buyPackage("thyroid-pkg-id", "ONE_MONTH");
```

### Step 3 — Buy Digital Product Example

```js
const buyDigitalProduct = async (productId) => {
  const orderRes = await fetch(
    "https://dr-dietician-backend.onrender.com/api/patient/payments/create-order",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${patientToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemType: "DIGITAL_PRODUCT",
        itemId: productId,
        // No duration needed for digital products
      }),
    }
  );

  const { data: orderData } = await orderRes.json();

  // Open Razorpay popup (same as above)
  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.orderId,
    name: "DrDiet Therapy",
    description: orderData.itemName,
    handler: async (response) => {
      const verifyRes = await fetch(
        "https://dr-dietician-backend.onrender.com/api/patient/payments/verify",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${patientToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        }
      );
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        alert("Payment successful! Download your product now.");
      }
    },
    theme: { color: "#0d9488" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

---

## Test Credentials (No Real Money)

```
Card Number: 4111 1111 1111 1111
Expiry:      Any future date (e.g. 12/28)
CVV:         Any 3 digits (e.g. 123)
OTP:         1234

UPI ID:      success@razorpay

NetBanking:  Select any bank → use test credentials shown
```

---

# PART 2: ADMIN REVENUE

All revenue endpoints require **Admin** authentication.

```http
Authorization: Bearer <admin_token>
```

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/revenue/summary` | Revenue dashboard summary |
| `GET` | `/admin/revenue/orders` | All orders with filters |

---

## 1) Revenue Summary

### Endpoint

```http
GET /admin/revenue/summary
```

### Full URL

```text
https://dr-dietician-backend.onrender.com/api/admin/revenue/summary
```

### Success Response

```json
{
  "success": true,
  "message": "Revenue summary fetched successfully",
  "data": {
    "summary": {
      "totalRevenue": 124500,
      "thisMonth": 18200,
      "thisWeek": 4500,
      "totalOrders": 89
    },
    "breakdown": {
      "packages": {
        "revenue": 68000,
        "percentage": 54.6
      },
      "digitalProducts": {
        "revenue": 32000,
        "percentage": 25.7
      }
    },
    "recentTransactions": [
      {
        "id": "order_id",
        "itemType": "PACKAGE",
        "itemName": "Thyroid Management - 1 Month",
        "amount": 1299,
        "duration": "ONE_MONTH",
        "paidAt": "2026-07-18T00:00:00.000Z",
        "patient": {
          "id": "patient_id",
          "fullName": "Sarah Jenkins",
          "email": "sarah@example.com",
          "profilePhotoUrl": null
        }
      }
    ]
  }
}
```

### Field Notes

- All `revenue` amounts are in ₹ (Indian Rupees)
- `percentage` is calculated as (category revenue / total revenue) × 100
- `recentTransactions` shows the last 10 paid orders

---

## 2) All Orders (with Filters)

### Endpoint

```http
GET /admin/revenue/orders
```

### Full URL

```text
https://dr-dietician-backend.onrender.com/api/admin/revenue/orders
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter by status |
| `itemType` | string | Filter by item type |
| `fromDate` | string | Start date (YYYY-MM-DD) |
| `toDate` | string | End date (YYYY-MM-DD) |

### Example URLs

```text
GET /admin/revenue/orders
GET /admin/revenue/orders?status=PAID
GET /admin/revenue/orders?itemType=PACKAGE
GET /admin/revenue/orders?status=PAID&itemType=DIGITAL_PRODUCT
GET /admin/revenue/orders?fromDate=2026-07-01&toDate=2026-07-31
GET /admin/revenue/orders?status=PAID&page=1&limit=20
```

### Success Response

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "items": [
      {
        "id": "order_id",
        "itemType": "PACKAGE",
        "itemName": "Thyroid Management - 1 Month",
        "amount": 1299,
        "currency": "INR",
        "duration": "ONE_MONTH",
        "status": "PAID",
        "razorpayOrderId": "order_QzXvYz123456",
        "razorpayPaymentId": "pay_QzXvYz789012",
        "paidAt": "2026-07-18T10:00:00.000Z",
        "createdAt": "2026-07-18T09:58:00.000Z",
        "patient": {
          "id": "patient_id",
          "fullName": "Sarah Jenkins",
          "email": "sarah@example.com",
          "profilePhotoUrl": null
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 89,
      "totalPages": 9
    }
  }
}
```

---

# Complete Endpoint List

```text
# Patient Payments
POST https://dr-dietician-backend.onrender.com/api/patient/payments/create-order
POST https://dr-dietician-backend.onrender.com/api/patient/payments/verify
GET  https://dr-dietician-backend.onrender.com/api/patient/payments/my-orders

# Admin Revenue
GET  https://dr-dietician-backend.onrender.com/api/admin/revenue/summary
GET  https://dr-dietician-backend.onrender.com/api/admin/revenue/orders
```

---

# Key Notes for Frontend

## Payment Flow
1. Always call `create-order` first — never hardcode order IDs
2. The `amount` from `create-order` is in **paise** (multiply ₹ by 100)
3. Pass `orderId` and `keyId` to Razorpay options
4. After successful payment, always call `verify` to confirm on backend
5. The `handler` function in Razorpay options receives the 3 fields needed for verify

## Package Duration Mapping

| Value | Display |
|-------|---------|
| `ONE_MONTH` | 1 Month |
| `THREE_MONTHS` | 3 Months |
| `SIX_MONTHS` | 6 Months |

## Order Status

| Status | Meaning |
|--------|---------|
| `PENDING` | Order created, payment not done |
| `PAID` | Payment verified and successful |
| `FAILED` | Payment failed or signature mismatch |
| `REFUNDED` | Refund processed |

## Amount Display
- All amounts stored and returned in ₹ (rupees) — **except** the `amount` in `create-order` response which is in paise for Razorpay
- Use `amount` from `my-orders` response for display (it's in ₹)
- Use `amount` from `create-order` response for Razorpay popup (it's in paise)

## Revenue Note
- Revenue APIs only count `PAID` orders
- `thisMonth` = current calendar month (1st to today)
- `thisWeek` = current week starting Monday
