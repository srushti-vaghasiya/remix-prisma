# Full-Stack Authentication System

A modern, production-ready authentication system built with React Router (Remix-style), TypeScript, Prisma ORM, and PostgreSQL.

## 🚀 Features

### Authentication
- ✅ Secure user registration and login
- ✅ Password hashing with bcrypt
- ✅ HTTP-only session cookies
- ✅ Protected routes with middleware
- ✅ Session persistence across page reloads
- ✅ Automatic logout functionality

### Validation & Security
- ✅ Server-side form validation with Yup
- ✅ Field-level and form-level error handling
- ✅ Input sanitization and validation
- ✅ Secure session management
- ✅ CSRF protection

### User Experience
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Toast notifications for user feedback
- ✅ Loading states for better UX
- ✅ Mobile-friendly navigation
- ✅ Accessible form components
- ✅ Error boundaries

### Technical Features
- ✅ TypeScript for type safety
- ✅ Prisma ORM for database operations
- ✅ PostgreSQL database
- ✅ Server-side rendering
- ✅ Hot Module Replacement (HMR)
- ✅ Production-ready deployment setup

## � Project Structure

```
├── app/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Input.tsx       # Form input component
│   │   │   ├── Button.tsx      # Button component
│   │   │   └── Card.tsx        # Card component
│   │   └── Navbar.tsx          # Navigation bar
│   ├── routes/
│   │   ├── _index.tsx          # Protected dashboard
│   │   ├── login.tsx           # Login page
│   │   ├── signup.tsx          # Registration page
│   │   └── logout.tsx          # Logout action
│   ├── utils/
│   │   ├── auth.server.ts      # Authentication utilities
│   │   ├── db.server.ts        # Database connection
│   │   ├── session.server.ts   # Session management
│   │   └── validator.ts        # Form validation schemas
│   ├── root.tsx                # Root layout
│   └── app.css                 # Global styles
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── generated/
│   └── prisma/                # Generated Prisma client
├── .env.example               # Environment variables template
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd remix-prisma-app
npm install
```

### 2. Environment Setup

Copy the environment variables template:

```bash
cp .env.example .env
```

Update `.env` with your database connection:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
SESSION_SECRET=your-super-secret-session-key-change-in-production
```

### 3. Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## 🔐 Authentication Flow

### Registration Flow
1. User navigates to `/signup`
2. Fills out registration form (email, password, optional name)
3. Form validation occurs on both client and server
4. Password is hashed with bcrypt
5. User is saved to database
6. Redirected to login with success message

### Login Flow
1. User navigates to `/login`
2. Enters email and password
3. Server validates credentials
4. If valid, creates secure session cookie
5. Redirects to protected dashboard

### Protected Routes
1. Middleware checks for valid session
2. If no session, redirects to login
3. If valid, fetches user data and renders page

### Logout Flow
1. User clicks logout button
2. Session is destroyed
3. Redirected to login page

## 🎨 UI Components

### Input Component
- Custom styled form inputs
- Password visibility toggle
- Error state handling
- Icon support
- Responsive design

### Button Component
- Multiple variants (primary, secondary, danger, outline)
- Loading states
- Icon support
- Disabled states

### Card Component
- Flexible layout component
- Header, title, and description variants
- Responsive padding options

### Navbar Component
- User authentication state
- Mobile-responsive menu
- Logout functionality
- User profile display

## 📊 Database Schema

```sql
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔧 Configuration

### Prisma Configuration
The Prisma client is configured in `prisma.config.ts` with PostgreSQL adapter support.

### Session Configuration
Sessions use HTTP-only cookies with:
- Secure flag in production
- 7-day expiration
- SameSite lax protection
- Custom secret key

### Validation Schemas
- **Login**: Email and password validation
- **Signup**: Email, password strength, and password confirmation

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables for Production
```env
DATABASE_URL=your-production-database-url
SESSION_SECRET=your-production-session-secret
NODE_ENV=production
```

### Docker Deployment

```bash
docker build -t auth-app .
docker run -p 3000:3000 auth-app
```

## 🧪 Testing the Application

### Test Authentication Flow
1. Navigate to `/signup`
2. Create a new account
3. Verify redirect to login with success message
4. Login with new credentials
5. Verify access to protected dashboard
6. Test logout functionality

### Test Validation
1. Try submitting forms with invalid data
2. Verify field-level error messages
3. Test password strength requirements
4. Verify email format validation

### Test Security
1. Try accessing protected routes without authentication
2. Verify redirect to login
3. Test session persistence
4. Verify logout destroys session

## 🔄 Development Workflow

### Adding New Features
1. Update database schema if needed
2. Generate new Prisma client
3. Create validation schemas
4. Build UI components
5. Implement server actions
6. Add client-side logic

### Database Changes
```bash
# Update schema
npx prisma db push

# Generate client
npx prisma generate

# View database
npx prisma studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the documentation
- Review the code comments
- Create an issue in the repository

---

Built with ❤️ using React Router, TypeScript, and Prisma
