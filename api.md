# API Documentation - وكيلي (Wakili) Platform

This document outlines all frontend-consumed API endpoints for the Wakili legal services platform. This is a shared reference between frontend and backend developers.

**Base URL:** `http://localhost:3000/api` (Development)  
**Production Base URL:** (To be configured)

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Home Page Endpoints](#home-page-endpoints)
3. [Lawyer Onboarding Endpoints](#lawyer-onboarding-endpoints)
4. [Client Profile Endpoints](#client-profile-endpoints)
5. [Lawyer Search Endpoints](#lawyer-search-endpoints)
6. [Error Handling](#error-handling)
7. [Authentication](#authentication)

---

## Authentication Endpoints

### 1. User Login

**Endpoint:** `POST /auth/login`

**Auth Required:** No (Public)

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "أحمد",
      "lastName": "محمد",
      "userType": "client",
      "phoneNumber": "+201001234567",
      "profileImage": "https://...",
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
```

---

### 2. User Registration

**Endpoint:** `POST /auth/register`

**Auth Required:** No (Public)

**Request Body:**

```json
{
  "email": "lawyer@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "علي",
  "lastName": "عبدالله",
  "userType": "lawyer",
  "phoneNumber": "+201001234567",
  "acceptTerms": true
}
```

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": "user-456",
      "email": "lawyer@example.com",
      "firstName": "علي",
      "lastName": "عبدالله",
      "userType": "lawyer",
      "phoneNumber": "+201001234567",
      "profileImage": null,
      "isEmailVerified": false,
      "createdAt": "2024-02-06T10:00:00Z"
    }
  }
}
```

**Status Codes:**

- `201` - User created successfully
- `400` - Validation error (invalid email format, weak password, etc.)
- `409` - Email already exists

---

### 3. Logout

**Endpoint:** `POST /auth/logout`

**Auth Required:** Yes (Bearer Token)

**Request Body:** Empty or `{}`

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### 4. Forgot Password (Request Reset)

**Endpoint:** `POST /auth/forgot-password`

**Auth Required:** No (Public)

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Password reset code sent to your email"
  }
}
```

**Note:** A reset code will be sent to the user's email. Valid for 15 minutes.

---

### 5. Reset Password (Confirm Reset)

**Endpoint:** `POST /auth/reset-password`

**Auth Required:** No (Public)

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Status Codes:**

- `200` - Password reset successfully
- `400` - Invalid code or expired code
- `404` - User not found

---

### 6. Verify Email

**Endpoint:** `POST /auth/verify-email`

**Auth Required:** No (Public)

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully",
    "user": {
      "id": "user-456",
      "email": "user@example.com",
      "firstName": "علي",
      "lastName": "عبدالله",
      "userType": "lawyer",
      "isEmailVerified": true
    }
  }
}
```

---

### 7. Resend Verification Email

**Endpoint:** `POST /auth/resend-verification`

**Auth Required:** No (Public)

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Verification email sent"
  }
}
```

---

### 8. Google OAuth Authentication

**Endpoint:** `POST /auth/google`

**Auth Required:** No (Public)

**Request Body:**

```json
{
  "googleToken": "eyJhbGciOiJSUzI1NiIs...",
  "userType": "client"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": "user-789",
      "email": "user@gmail.com",
      "firstName": "محمد",
      "lastName": "علي",
      "userType": "client",
      "profileImage": "https://lh3.googleusercontent.com/...",
      "isEmailVerified": true
    }
  }
}
```

**Status Codes:**

- `200` - User authenticated/created via Google
- `400` - Invalid Google token
- `422` - First-time Google user needs to select user type

---

### 9. Get Current User

**Endpoint:** `GET /auth/me`

**Auth Required:** Yes (Bearer Token)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user-456",
    "email": "user@example.com",
    "firstName": "علي",
    "lastName": "عبدالله",
    "userType": "lawyer",
    "phoneNumber": "+201001234567",
    "profileImage": "https://...",
    "isEmailVerified": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### 10. Refresh Access Token

**Endpoint:** `POST /auth/refresh`

**Auth Required:** No (Public, uses Refresh Token)

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

---

### 11. Check Email Exists

**Endpoint:** `POST /auth/check-email`

**Auth Required:** No (Public)

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "exists": true
  }
}
```

---

## Home Page Endpoints

### 1. Get Home Page Data

**Endpoint:** `GET /home/data`

**Auth Required:** No (Public)

**Query Parameters:** None

**Response:**

```json
{
  "success": true,
  "data": {
    "testimonials": [
      {
        "id": "testimonial-1",
        "clientName": "أحمد محمد",
        "clientImage": "https://...",
        "testimonialText": "خدمة رائعة وموثوقة جداً...",
        "rating": 5,
        "lawyerName": "علي عبدالله",
        "serviceCategory": "قانون العمل",
        "date": "2024-01-15"
      }
    ],
    "topLawyers": [
      {
        "id": "lawyer-1",
        "firstName": "علي",
        "lastName": "عبدالله",
        "profileImage": "https://...",
        "specialties": ["قانون العمل", "القانون التجاري"],
        "rating": 4.9,
        "reviewCount": 248,
        "hourlyRate": 250,
        "isVerified": true,
        "yearsOfExperience": 15,
        "bio": "محام متخصص في قانون العمل..."
      }
    ],
    "statistics": [
      {
        "id": "stat-1",
        "label": "محامي معتمدين",
        "value": "500+",
        "description": "محامي موثقين ومعتمدين"
      }
    ]
  }
}
```

---

### 2. Get Testimonials

**Endpoint:** `GET /testimonials`

**Auth Required:** No (Public)

**Query Parameters:**

- `limit` (optional, default: 6): Number of testimonials to return

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "testimonial-1",
      "clientName": "أحمد محمد",
      "testimonialText": "...",
      "rating": 5,
      "lawyerName": "علي عبدالله",
      "serviceCategory": "قانون العمل",
      "date": "2024-01-15"
    }
  ]
}
```

---

### 3. Get Statistics

**Endpoint:** `GET /statistics`

**Auth Required:** No (Public)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "stat-1",
      "label": "محامي معتمدين",
      "value": "500+",
      "description": "محامي موثقين ومعتمدين"
    }
  ]
}
```

---

## Lawyer Onboarding Endpoints

### 1. Save Basic Info (Step 1)

**Endpoint:** `POST /lawyer/onboarding/basic-info`

**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "fullName": "علي عبدالله",
  "email": "lawyer@example.com",
  "profileImage": null,
  "phoneCode": "+20",
  "phoneNumber": "1001234567",
  "country": "مصر",
  "city": "القاهرة",
  "bio": "محام متخصص في قانون العمل...",
  "yearsOfExperience": "15",
  "practiceAreas": ["قانون العمل", "القانون التجاري"],
  "sessionTypes": ["استشارة مباشرة", "استشارة فيديو"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Basic info saved successfully",
    "progress": {
      "currentStep": 2,
      "completedSteps": [1],
      "data": { ... },
      "lastUpdated": "2024-02-06T10:00:00Z"
    }
  }
}
```

---

### 2. Save Education (Step 2)

**Endpoint:** `POST /lawyer/onboarding/education`

**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "academicQualifications": [
    {
      "id": "1",
      "degreeType": "License",
      "fieldOfStudy": "Law",
      "universityName": "جامعة القاهرة",
      "graduationYear": "2009"
    }
  ],
  "professionalCertifications": [
    {
      "id": "1",
      "certificateName": "Commercial Law Certif.",
      "issuingOrganization": "Egyptian Bar Association",
      "yearObtained": "2015",
      "document": "base64-encoded-file"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Education info saved",
    "progress": {
      "currentStep": 3,
      "completedSteps": [1, 2],
      "lastUpdated": "2024-02-06T10:05:00Z"
    }
  }
}
```

---

### 3. Save Experience (Step 3)

**Endpoint:** `POST /lawyer/onboarding/experience`

**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "workExperiences": [
    {
      "id": "1",
      "jobTitle": "Senior Lawyer",
      "organizationName": "Law Firm ABC",
      "startYear": "2015",
      "endYear": "2020",
      "isCurrentJob": false,
      "description": "Handled corporate litigation..."
    },
    {
      "id": "2",
      "jobTitle": "Consultant",
      "organizationName": "Law Firm XYZ",
      "startYear": "2020",
      "endYear": "",
      "isCurrentJob": true,
      "description": "Providing legal consultations..."
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Experience saved",
    "progress": {
      "currentStep": 4,
      "completedSteps": [1, 2, 3],
      "lastUpdated": "2024-02-06T10:10:00Z"
    }
  }
}
```

---

### 4. Upload Verification Documents (Step 4)

**Endpoint:** `POST /lawyer/onboarding/verification`

**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "nationalIdFront": {
    "file": "base64-encoded-or-file-path",
    "fileName": "id_front.pdf",
    "status": "uploaded"
  },
  "nationalIdBack": {
    "file": "base64-encoded-or-file-path",
    "fileName": "id_back.pdf",
    "status": "uploaded"
  },
  "lawyerLicense": {
    "file": "base64-encoded-or-file-path",
    "fileName": "license.pdf",
    "status": "uploaded"
  },
  "educationalCertificates": [
    {
      "file": "base64-encoded-or-file-path",
      "fileName": "degree.pdf",
      "status": "uploaded"
    }
  ],
  "professionalCertificates": [
    {
      "file": "base64-encoded-or-file-path",
      "fileName": "certification.pdf",
      "status": "uploaded"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Documents uploaded for verification",
    "progress": {
      "currentStep": 5,
      "completedSteps": [1, 2, 3, 4],
      "lastUpdated": "2024-02-06T10:15:00Z"
    }
  }
}
```

---

### 5. Get Onboarding Progress

**Endpoint:** `GET /lawyer/onboarding/progress`

**Auth Required:** Yes (Bearer Token)

**Response:**

```json
{
  "success": true,
  "data": {
    "currentStep": 3,
    "completedSteps": [1, 2],
    "data": {
      "basicInfo": { ... },
      "education": { ... }
    },
    "lastUpdated": "2024-02-06T10:10:00Z"
  }
}
```

---

### 6. Submit Complete Onboarding (Step 5)

**Endpoint:** `POST /lawyer/onboarding/submit`

**Auth Required:** Yes (Bearer Token)

**Request Body:** Complete onboarding data (all steps)

```json
{
  "basicInfo": { ... },
  "education": { ... },
  "experience": { ... },
  "verification": { ... }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Onboarding submitted successfully. Awaiting admin verification.",
    "lawyerId": "lawyer-456"
  }
}
```

**Status Codes:**

- `200` - Submission successful, pending verification
- `400` - Validation error (missing or invalid data)
- `422` - Insufficient documents or data

---

## Client Profile Endpoints

### 1. Get Client Profile

**Endpoint:** `GET /client/profile`

**Auth Required:** Yes (Bearer Token)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "client-123",
    "firstName": "أسامة",
    "lastName": "أحمد",
    "email": "usama@email.com",
    "phoneNumber": "+201001234567",
    "profileImage": "https://api.wakili.com/uploads/profiles/client-123.jpg",
    "coverImage": "https://api.wakili.com/uploads/covers/client-123.jpg",
    "bio": "مهتم بالاستشارات القانونية في مجال العمل والتجارة",
    "location": "القاهرة، مصر",
    "joinedDate": "2024-01-15T10:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-02-06T10:00:00Z"
  }
}
```

**Status Codes:**

- `200` - Profile retrieved successfully
- `401` - Unauthorized (missing or invalid token)
- `404` - Profile not found

---

### 2. Update Client Profile

**Endpoint:** `PUT /client/profile`

**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "firstName": "أسامة",
  "lastName": "أحمد",
  "phoneNumber": "+201001234567",
  "bio": "مهتم بالاستشارات القانونية",
  "location": "القاهرة، مصر"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "client-123",
    "firstName": "أسامة",
    "lastName": "أحمد",
    "email": "usama@email.com",
    "phoneNumber": "+201001234567",
    "profileImage": "https://api.wakili.com/uploads/profiles/client-123.jpg",
    "coverImage": "https://api.wakili.com/uploads/covers/client-123.jpg",
    "bio": "مهتم بالاستشارات القانونية",
    "location": "القاهرة، مصر",
    "joinedDate": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-02-06T10:30:00Z"
  }
}
```

**Status Codes:**

- `200` - Profile updated successfully
- `400` - Validation error (invalid phone format, etc.)
- `401` - Unauthorized

---

### 3. Upload Profile Image

**Endpoint:** `POST /client/profile/image`

**Auth Required:** Yes (Bearer Token)

**Content-Type:** `multipart/form-data`

**Request Body:**

- `file`: Image file (JPEG, PNG, WebP)
- Max size: 5MB
- Recommended dimensions: 400x400px

**Response:**

```json
{
  "success": true,
  "data": {
    "imageUrl": "https://api.wakili.com/uploads/profiles/client-123-1707219600.jpg",
    "uploadedAt": "2024-02-06T10:00:00Z"
  }
}
```

**Status Codes:**

- `200` - Image uploaded successfully
- `400` - Invalid file type or size exceeds limit
- `401` - Unauthorized
- `413` - Payload too large

---

### 4. Upload Cover Image

**Endpoint:** `POST /client/profile/cover`

**Auth Required:** Yes (Bearer Token)

**Content-Type:** `multipart/form-data`

**Request Body:**

- `file`: Image file (JPEG, PNG, WebP)
- Max size: 10MB
- Recommended dimensions: 1200x400px

**Response:**

```json
{
  "success": true,
  "data": {
    "imageUrl": "https://api.wakili.com/uploads/covers/client-123-1707219600.jpg",
    "uploadedAt": "2024-02-06T10:00:00Z"
  }
}
```

**Status Codes:**

- `200` - Cover image uploaded successfully
- `400` - Invalid file type or size exceeds limit
- `401` - Unauthorized
- `413` - Payload too large

---

### 5. Get Favorite Lawyers

**Endpoint:** `GET /client/favorites`

**Auth Required:** Yes (Bearer Token)

**Query Parameters:**

- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10): Number of items per page

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "lawyer-1",
      "firstName": "علي",
      "lastName": "عبدالله",
      "profileImage": "https://api.wakili.com/uploads/profiles/lawyer-1.jpg",
      "specialties": ["قانون العمل", "القانون التجاري"],
      "rating": 4.9,
      "reviewCount": 248,
      "hourlyRate": 250,
      "isVerified": true,
      "yearsOfExperience": 15,
      "bio": "محام متخصص في قانون العمل والقانون التجاري",
      "city": "القاهرة",
      "country": "مصر",
      "addedAt": "2024-01-20T10:00:00Z"
    },
    {
      "id": "lawyer-2",
      "firstName": "فاطمة",
      "lastName": "محمد",
      "profileImage": "https://api.wakili.com/uploads/profiles/lawyer-2.jpg",
      "specialties": ["قانون الأسرة", "القانون الجنائي"],
      "rating": 4.8,
      "reviewCount": 189,
      "hourlyRate": 300,
      "isVerified": true,
      "yearsOfExperience": 12,
      "bio": "محامية متخصصة في قانون الأسرة والقضايا الجنائية",
      "city": "الإسكندرية",
      "country": "مصر",
      "addedAt": "2024-01-25T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 2,
    "itemsPerPage": 10
  }
}
```

**Status Codes:**

- `200` - Favorites retrieved successfully
- `401` - Unauthorized

---

### 6. Add Lawyer to Favorites

**Endpoint:** `POST /client/favorites/:lawyerId`

**Auth Required:** Yes (Bearer Token)

**URL Parameters:**

- `lawyerId`: The ID of the lawyer to add to favorites

**Request Body:** Empty or `{}`

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Lawyer added to favorites",
    "lawyerId": "lawyer-1",
    "addedAt": "2024-02-06T10:00:00Z"
  }
}
```

**Status Codes:**

- `200` - Lawyer added to favorites
- `400` - Lawyer already in favorites
- `401` - Unauthorized
- `404` - Lawyer not found

---

### 7. Remove Lawyer from Favorites

**Endpoint:** `DELETE /client/favorites/:lawyerId`

**Auth Required:** Yes (Bearer Token)

**URL Parameters:**

- `lawyerId`: The ID of the lawyer to remove from favorites

**Request Body:** None

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Lawyer removed from favorites",
    "lawyerId": "lawyer-1"
  }
}
```

**Status Codes:**

- `200` - Lawyer removed from favorites
- `401` - Unauthorized
- `404` - Lawyer not found in favorites

---

### 8. Get Client Bookings

**Endpoint:** `GET /client/bookings`

**Auth Required:** Yes (Bearer Token)

**Query Parameters:**

- `status` (optional): Filter by booking status (`pending`, `confirmed`, `completed`, `cancelled`)
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10): Number of items per page

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "booking-1",
      "lawyerName": "علي عبدالله",
      "lawyerImage": "https://api.wakili.com/uploads/profiles/lawyer-1.jpg",
      "serviceType": "استشارة فيديو",
      "date": "2024-02-15",
      "time": "10:00 ص",
      "status": "confirmed",
      "duration": "45 دقيقة",
      "price": 250,
      "notes": "استشارة حول قضية عمل",
      "bookingCode": "BK-123456",
      "createdAt": "2024-02-01T10:00:00Z"
    },
    {
      "id": "booking-2",
      "lawyerName": "فاطمة محمد",
      "lawyerImage": "https://api.wakili.com/uploads/profiles/lawyer-2.jpg",
      "serviceType": "استشارة مباشرة",
      "date": "2024-02-20",
      "time": "02:00 م",
      "status": "pending",
      "duration": "30 دقيقة",
      "price": 300,
      "notes": "استشارة أسرية",
      "bookingCode": "BK-123457",
      "createdAt": "2024-02-03T10:00:00Z"
    },
    {
      "id": "booking-3",
      "lawyerName": "أحمد حسن",
      "lawyerImage": "https://api.wakili.com/uploads/profiles/lawyer-3.jpg",
      "serviceType": "استشارة هاتفية",
      "date": "2024-01-10",
      "time": "11:00 ص",
      "status": "completed",
      "duration": "60 دقيقة",
      "price": 200,
      "notes": "استشارة تجارية",
      "bookingCode": "BK-123458",
      "createdAt": "2024-01-05T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 3,
    "itemsPerPage": 10
  }
}
```

**Status Codes:**

- `200` - Bookings retrieved successfully
- `401` - Unauthorized

---

### 9. Update Client Password

**Endpoint:** `PUT /client/password`

**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "oldPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "تم تحديث كلمة المرور بنجاح"
  }
}
```

**Status Codes:**

- `200` - Password updated successfully
- `400` - Validation error (old password incorrect, weak password, etc.)
- `401` - Unauthorized

---

## Lawyer Search Endpoints

### 1. Search Lawyers

**Endpoint:** `GET /lawyer/search`

**Auth Required:** No (Public)

**Query Parameters:**

- `query` (optional): Search by lawyer name or specialties
- `practiceArea` (optional): Filter by practice area
- `location` (optional): Filter by city/location
- `minPrice` (optional): Minimum hourly rate
- `maxPrice` (optional): Maximum hourly rate
- `minRating` (optional): Minimum rating (1-5)
- `sessionTypes` (optional): Comma-separated session types (مكتب, هاتف)
- `sortBy` (optional): Sort by (rating, price-low, price-high, reviews)
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 6): Number of results per page

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "lawyer-1",
        "firstName": "أحمد",
        "lastName": "سليمان",
        "specialty": "قانون تجاري",
        "specialties": ["قانون تجاري", "القانون المالي"],
        "profileImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed1",
        "location": "القاهرة",
        "city": "القاهرة",
        "country": "مصر",
        "rating": 4.9,
        "reviewCount": 127,
        "hourlyRate": 500,
        "yearsOfExperience": 15,
        "sessionTypes": ["مكتب", "هاتف"],
        "isVerified": true,
        "bio": "متخصص في القانون التجاري والعقود التجارية"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 28,
      "itemsPerPage": 6
    }
  }
}
```

**Status Codes:**

- `200` - Search completed successfully
- `400` - Invalid query parameters

---

### 2. Get Practice Areas

**Endpoint:** `GET /lawyer/practice-areas`

**Auth Required:** No (Public)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "area-1",
      "name": "قانون تجاري",
      "description": "العقود والقانون التجاري والمالي",
      "icon": "briefcase"
    },
    {
      "id": "area-2",
      "name": "قانون الأسرة",
      "description": "الزواج والطلاق والحضانة والميراث",
      "icon": "heart"
    },
    {
      "id": "area-3",
      "name": "قانون جنائي",
      "description": "الدفاع الجنائي والقضايا الجنائية",
      "icon": "scale"
    }
  ]
}
```

**Status Codes:**

- `200` - Practice areas retrieved successfully

---

### 3. Get Locations

**Endpoint:** `GET /lawyer/locations`

**Auth Required:** No (Public)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "loc-1",
      "name": "القاهرة",
      "city": "القاهرة",
      "country": "مصر"
    },
    {
      "id": "loc-2",
      "name": "الإسكندرية",
      "city": "الإسكندرية",
      "country": "مصر"
    },
    {
      "id": "loc-3",
      "name": "الجيزة",
      "city": "الجيزة",
      "country": "مصر"
    }
  ]
}
```

**Status Codes:**

- `200` - Locations retrieved successfully

---

### 4. Get Lawyer Details

**Endpoint:** `GET /lawyer/:id`

**Auth Required:** No (Public)

**URL Parameters:**

- `id`: Lawyer ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "lawyer-1",
    "firstName": "أحمد",
    "lastName": "سليمان",
    "specialty": "قانون تجاري",
    "specialties": ["قانون تجاري", "القانون المالي"],
    "profileImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed1",
    "location": "القاهرة",
    "city": "القاهرة",
    "country": "مصر",
    "rating": 4.9,
    "reviewCount": 127,
    "hourlyRate": 500,
    "yearsOfExperience": 15,
    "sessionTypes": ["مكتب", "هاتف"],
    "isVerified": true,
    "bio": "متخصص في القانون التجاري والعقود التجارية"
  }
}
```

**Status Codes:**

- `200` - Lawyer details retrieved successfully
- `404` - Lawyer not found

---

### 5. Add Lawyer to Favorites

**Endpoint:** `POST /lawyer/:lawyerId/favorite`

**Auth Required:** Yes (Bearer Token)

**URL Parameters:**

- `lawyerId`: Lawyer ID to add to favorites

**Request Body:** Empty or `{}`

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "تم إضافة المحامي إلى المفضلة"
  }
}
```

**Status Codes:**

- `200` - Lawyer added to favorites
- `401` - Unauthorized
- `404` - Lawyer not found

---

### 6. Remove Lawyer from Favorites

**Endpoint:** `DELETE /lawyer/:lawyerId/favorite`

**Auth Required:** Yes (Bearer Token)

**URL Parameters:**

- `lawyerId`: Lawyer ID to remove from favorites

**Request Body:** None

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "تم إزالة المحامي من المفضلة"
  }
}
```

**Status Codes:**

- `200` - Lawyer removed from favorites
- `401` - Unauthorized
- `404` - Lawyer not found

---

## Error Handling

All endpoints return a consistent error response format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "statusCode": 400,
  "data": { "details": "Additional error information if applicable" }
}
```

### Common Status Codes

| Code  | Meaning       | Use Cases                                     |
| ----- | ------------- | --------------------------------------------- |
| `200` | OK            | Successful request                            |
| `201` | Created       | Resource created successfully                 |
| `400` | Bad Request   | Validation errors, missing fields             |
| `401` | Unauthorized  | Missing or invalid authentication token       |
| `403` | Forbidden     | Authenticated but not authorized for resource |
| `404` | Not Found     | Resource does not exist                       |
| `409` | Conflict      | Duplicate email, etc.                         |
| `422` | Unprocessable | Validation error on server side               |
| `500` | Server Error  | Internal server error                         |

---

## Authentication

### Bearer Token

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Management

1. **Token Acquisition:**
   - Login: `/auth/login`
   - Register: `/auth/register`
   - Google OAuth: `/auth/google`

2. **Token Refresh:**
   - Use `/auth/refresh` with refresh token to get new access token

3. **Token Storage:**
   - Store `accessToken` in localStorage or memory (secure)
   - Store `refreshToken` in secure HttpOnly cookie (if possible) or localStorage

4. **Token Expiration:**
   - Access tokens expire after time specified in `expiresIn` (in seconds)
   - Call `/auth/refresh` before expiration using refresh token

---

## Rate Limiting

(To be defined by backend team)

---

## CORS

Frontend is configured to access the API at the base URL. Ensure backend has proper CORS headers configured.

---

**Last Updated:** February 7, 2026  
**Version:** 1.3.0

**Changelog:**

- v1.3.0 (Feb 7, 2026): Added Lawyer Search Endpoints section with 6 endpoints (search, practice areas, locations, lawyer details, add/remove favorites)
- v1.2.0 (Feb 7, 2026): Updated Client Profile Endpoints - merged account settings into password update endpoint (9 endpoints total: profile management, favorites, bookings, password update)
- v1.1.0 (Feb 7, 2024): Added Client Profile Endpoints section with 10 endpoints (profile management, favorites, bookings, settings)
- v1.0.0 (Feb 6, 2024): Initial version with Authentication, Home Page, and Lawyer Onboarding endpoints
