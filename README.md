# Rent Management Backend

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rent-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Google App Password Setup

To use Gmail for sending emails, you need to set up an App Password:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
3. **Update your .env file**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### 4. Start Server
```bash
npm start
```

## API Endpoints

- `POST /api/auth/login` - Agent login
- `POST /api/auth/register` - Agent registration (optional)
- `GET /api/auth/profile` - Get agent profile (protected)

## Features

- ✅ Agent authentication
- ✅ JWT token-based security
- ✅ Password hashing with bcrypt
- ✅ MongoDB integration
- ✅ Email functionality (with Google App Password) 