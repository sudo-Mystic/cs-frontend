# Quick Setup Guide - Prequalification Exam Frontend

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:8000`
- pnpm (or npm/yarn) package manager

### Installation Steps

1. **Navigate to the project directory**
```bash
cd with-typetext
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. **Run the development server**
```bash
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Implementation

### Step-by-Step Test Flow

1. **Registration** (`/auth`)
   - Click "Register Now"
   - Fill in all required fields:
     - First Name: John
     - Last Name: Doe
     - Username: johndoe
     - Email: john@example.com
     - Country Code: 1
     - Phone: 1234567890
     - Designation: Student
     - Password: SecurePass123!
     - Confirm Password: SecurePass123!
   - Click "Create Account"
   - Wait for success message

2. **Login** (`/auth`)
   - Enter username: johndoe
   - Enter password: SecurePass123!
   - Click "Login"
   - Should redirect to dashboard

3. **Dashboard** (`/dashboard`)
   - View your profile information
   - See qualification status (should be "Pending")
   - View available prequalification exams
   - Click "Start Exam" on an exam card

4. **Take Exam** (`/prequalification-exam/[id]`)
   - Read each question carefully
   - For MCQ: Select an option
   - For Subjective: Type your answer
   - Use the question navigation grid to jump between questions
   - Monitor your progress in the header
   - Click "Next" to move forward
   - Click "Previous" to go back
   - When ready, click "Submit Exam"

5. **View Results** (`/results/[id]`)
   - See your overall score and percentage
   - View qualification status update
   - Review each answer with feedback
   - Green checkmarks = correct
   - Red X marks = incorrect
   - Read AI-generated reasoning
   - Click "Back to Dashboard"

## 🎯 Sample Test Data

### Backend Setup (Django)
Ensure your backend has:
- At least one prequalification assessment created
- Questions added to that assessment
- Correct answers configured

### Frontend Expected Behavior
- Registration should create a new student account
- Login should store JWT tokens in localStorage
- Dashboard should fetch and display exams
- Exam page should load all questions
- Submission should trigger automatic grading
- Results should show updated qualification status

## 🔍 Debugging Tips

### Check Browser Console
Open Developer Tools (F12) and check:
- Network tab: See all API requests
- Console tab: View any errors
- Application tab: Check localStorage for tokens

### Common Issues

**Cannot connect to API**
```bash
# Check if backend is running
curl http://localhost:8000/api/assessments/

# Verify CORS settings in Django
# settings.py should have:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

**Authentication errors**
```javascript
// Clear tokens and try again
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
// Then login again
```

**TypeScript errors**
```bash
# Rebuild types
pnpm build
# Or restart dev server
pnpm dev
```

## 📊 API Endpoints to Verify

Test these endpoints directly:

```bash
# 1. Health check
curl http://localhost:8000/api/

# 2. Register (should work)
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirm_password": "TestPass123!",
    "first_name": "Test",
    "last_name": "User",
    "phone": "11234567890",
    "designation": "student"
  }'

# 3. Login (get token)
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "TestPass123!"}'

# 4. Get assessments (use token from step 3)
curl http://localhost:8000/api/assessments/?type=prequalification \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 5. Get student profile
curl http://localhost:8000/api/users/profiles/students/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🎨 UI Components Used

All components are from Shadcn UI:
- ✅ Button
- ✅ Card (with CardHeader, CardContent, CardTitle, CardDescription)
- ✅ Input
- ✅ Label
- ✅ Textarea
- ✅ RadioGroup (with RadioGroupItem)
- ✅ Select (with SelectTrigger, SelectContent, SelectItem)
- ✅ Alert (with AlertDescription)
- ✅ Badge
- ✅ Progress
- ✅ Separator

## 🔐 Security Checklist

- [x] JWT tokens stored securely in localStorage
- [x] Authorization headers auto-added to requests
- [x] Automatic redirect on auth failure
- [x] Protected routes check for authentication
- [x] Tokens cleared on logout
- [x] HTTPS-ready configuration
- [x] Input validation on forms

## 📱 Responsive Testing

Test on these viewports:
- 📱 Mobile: 375px width
- 📱 Tablet: 768px width
- 💻 Desktop: 1280px width
- 🖥️ Large Desktop: 1920px width

## 🎓 Learning Objectives Achieved

After implementing this project, you'll understand:
- ✅ Next.js 15 App Router
- ✅ React Server Components vs Client Components
- ✅ TypeScript in React applications
- ✅ RESTful API integration
- ✅ JWT authentication flow
- ✅ Form handling and validation
- ✅ State management with hooks
- ✅ Dynamic routing with parameters
- ✅ Error handling patterns
- ✅ Loading states and UX
- ✅ Responsive design with Tailwind CSS
- ✅ Component composition with Shadcn UI

## 📝 Next Steps

After successful testing:

1. **Customize Styling**
   - Update colors in `tailwind.config.ts`
   - Modify component styles

2. **Add Features**
   - Implement timer for exams
   - Add exam attempt history
   - Create admin dashboard

3. **Deploy**
   - Set up Vercel/Netlify for frontend
   - Configure production API URL
   - Set environment variables

4. **Optimize**
   - Add error boundaries
   - Implement retry logic
   - Add loading skeletons
   - Optimize images

## 🤝 Support

If you encounter issues:
1. Check the console for errors
2. Verify backend is running
3. Test API endpoints directly
4. Clear browser cache/storage
5. Review the implementation documentation

## 📚 Further Reading

- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [React Hooks Reference](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

**Happy coding! 🚀**

For detailed implementation information, see `PREQUALIFICATION_IMPLEMENTATION.md`
