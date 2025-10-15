# Quick Reference Card - Prequalification Exam System

## 🚀 Quick Start
```bash
cd with-typetext
pnpm install
pnpm dev
# Open http://localhost:3000
```

## 📋 File Structure
```
lib/
├── api.ts      # API client & auth
└── types.ts    # TypeScript interfaces

app/
├── auth/page.tsx                    # Login & Register
├── dashboard/page.tsx               # Student Dashboard
├── prequalification-exam/[id]/page.tsx  # Exam Interface
└── results/[id]/page.tsx            # Results Display
```

## 🔗 Routes
| Route | Purpose | Protected |
|-------|---------|-----------|
| `/auth` | Login/Register | No |
| `/dashboard` | Student home | Yes |
| `/prequalification-exam/[id]` | Take exam | Yes |
| `/results/[id]` | View results | Yes |

## 🌐 API Endpoints
```typescript
// Authentication
POST   /api/users/register/        // Register
POST   /api/token/                  // Login

// Exams
GET    /api/assessments/            // List all
GET    /api/assessments/{id}/       // Get one
GET    /api/assessments/?type=prequalification

// Submissions
POST   /api/submissions/            // Submit exam
GET    /api/submissions/{id}/       // Get results

// Profile
GET    /api/users/profiles/students/  // Get profile
```

## 💾 State Management
```typescript
// Token Storage
localStorage.setItem('access_token', token)
localStorage.setItem('refresh_token', token)

// Answer State
const [answers, setAnswers] = useState<Record<number, string>>({})

// Update answer
setAnswers(prev => ({ ...prev, [questionId]: answerText }))
```

## 🔐 Authentication
```typescript
// Check if authenticated
const isAuth = localStorage.getItem('access_token') !== null

// Get auth headers
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`
}

// Logout
localStorage.removeItem('access_token')
localStorage.removeItem('refresh_token')
router.push('/auth')
```

## 📊 Key Types
```typescript
interface Assessment {
  id: number
  title: string
  questions: Question[]
  total_marks: number
  passing_marks: number
}

interface Question {
  id: number
  question_text: string
  question_type: 'mcq' | 'subjective'
  options?: string[]
  marks: number
}

interface Submission {
  id: number
  score: number
  percentage: number
  answers: AnswerResult[]
}

interface StudentProfile {
  qual_status: 'pending' | 'qualified' | 'not_qualified'
  prequalification_score: number | null
}
```

## 🎨 Common UI Patterns

### Loading State
```tsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudseals-blue" />
    </div>
  )
}
```

### Error Display
```tsx
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

### Protected Route
```tsx
useEffect(() => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    router.push('/auth')
    return
  }
  setIsAuthenticated(true)
  loadData()
}, [router])
```

## 🔄 Data Flow Patterns

### Fetch Data
```typescript
const loadData = async () => {
  setIsLoading(true)
  setError('')
  try {
    const data = await api.getAssessments('prequalification')
    setAssessments(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}
```

### Submit Data
```typescript
const handleSubmit = async () => {
  setIsSubmitting(true)
  try {
    const result = await api.submitAnswers(payload)
    router.push(`/results/${result.id}`)
  } catch (err) {
    setError(err.message)
  } finally {
    setIsSubmitting(false)
  }
}
```

### Parallel Requests
```typescript
const [data1, data2] = await Promise.all([
  api.getAssessments(),
  api.getStudentProfile(),
])
```

## 🎯 Form Handling

### MCQ Question
```tsx
<RadioGroup
  value={answers[question.id] || ''}
  onValueChange={(value) => handleAnswerChange(question.id, value)}
>
  {question.options?.map((option, index) => (
    <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border">
      <RadioGroupItem value={option} id={`q${question.id}-opt${index}`} />
      <Label htmlFor={`q${question.id}-opt${index}`}>{option}</Label>
    </div>
  ))}
</RadioGroup>
```

### Subjective Question
```tsx
<Textarea
  value={answers[question.id] || ''}
  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
  placeholder="Type your answer here..."
  rows={6}
/>
```

## 🎨 Styling Utilities

### Colors
- `cloudseals-blue` - Primary blue
- `cloudseals-purple` - Secondary purple
- `cloudseals-lightblue` - Accent blue
- `cloudseals-green` - Success green
- `cloudseals-dark` - Dark background

### Common Classes
```tsx
// Container
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"

// Card
className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6"

// Button Primary
className="bg-cloudseals-blue hover:bg-cloudseals-purple"

// Button Success
className="bg-green-600 hover:bg-green-700"

// Text Colors
className="text-gray-900 dark:text-white"
```

## 🐛 Debugging Commands

### Check Backend Connection
```bash
curl http://localhost:8000/api/assessments/
```

### Check Authentication
```javascript
// In browser console
console.log(localStorage.getItem('access_token'))
```

### Clear All Data
```javascript
localStorage.clear()
```

### View Network Requests
```
F12 → Network Tab → Filter: Fetch/XHR
```

## ⚡ Quick Fixes

### Issue: Can't login
```javascript
// Clear tokens and try again
localStorage.removeItem('access_token')
localStorage.removeItem('refresh_token')
```

### Issue: CORS error
```python
# In Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Issue: TypeScript errors
```bash
# Restart dev server
pnpm dev
```

### Issue: Components not found
```bash
# Reinstall dependencies
pnpm install
```

## 📊 Performance Tips

1. **Parallel API Calls**: Use `Promise.all()`
2. **Memoization**: Use `useMemo` for expensive calculations
3. **Lazy Loading**: Import components dynamically
4. **Image Optimization**: Use Next.js Image component
5. **Code Splitting**: Automatic with Next.js App Router

## 🔒 Security Checklist

- [x] Tokens stored in localStorage
- [x] Authorization headers on protected routes
- [x] Input validation on forms
- [x] Error messages don't expose sensitive data
- [x] Automatic logout on token expiry
- [x] HTTPS ready

## 📱 Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm:  640px   // Mobile landscape
md:  768px   // Tablet
lg:  1024px  // Desktop
xl:  1280px  // Large desktop
2xl: 1536px  // Extra large
```

## 🎓 Common Patterns

### Navigation
```typescript
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/dashboard')
```

### URL Parameters
```typescript
import { useParams } from 'next/navigation'
const params = useParams()
const id = parseInt(params.id as string)
```

### Conditional Rendering
```tsx
{isLoading ? <Spinner /> : <Content />}
{error && <ErrorMessage />}
{data?.length > 0 && <List data={data} />}
```

## 🧪 Test Credentials

Create test user via registration or use existing:
```
Username: testuser
Password: TestPass123!
```

## 📦 Dependencies

```json
{
  "next": "15.2.4",
  "react": "^19",
  "typescript": "^5",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.454.0"
}
```

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 📞 Quick Help

**Cannot start dev server?**
```bash
rm -rf .next
pnpm dev
```

**TypeScript errors?**
```bash
pnpm build
```

**Need to reset database?**
Ask backend team

**API not responding?**
Check if backend is running on port 8000

---

**Keep this card handy for quick reference during development!**
