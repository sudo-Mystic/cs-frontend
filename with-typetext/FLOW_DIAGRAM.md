# Prequalification Exam Flow Diagram

## 🔄 Complete User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PREQUALIFICATION EXAM SYSTEM                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         1. AUTHENTICATION                        │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  /auth   │ Landing Page
    └────┬─────┘
         │
         ├─────► Register Path
         │         │
         │         ├─► Fill Form (username, email, password, etc.)
         │         │
         │         ├─► POST /api/users/register/
         │         │      │
         │         │      ├─► ✅ Success → Show message → Switch to Login
         │         │      └─► ❌ Error → Display validation errors
         │         │
         └─────► Login Path
                   │
                   ├─► Enter credentials
                   │
                   ├─► POST /api/token/
                   │      │
                   │      ├─► ✅ Success
                   │      │      ├─► Store access_token
                   │      │      ├─► Store refresh_token
                   │      │      └─► Redirect to /dashboard
                   │      │
                   │      └─► ❌ Error → Display error message

┌─────────────────────────────────────────────────────────────────┐
│                         2. DASHBOARD                             │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │  /dashboard  │ Protected Route
    └──────┬───────┘
           │
           ├─► Check Authentication
           │      │
           │      ├─► ✅ Token exists → Continue
           │      └─► ❌ No token → Redirect to /auth
           │
           ├─► Parallel API Calls:
           │      │
           │      ├─► GET /api/assessments/?type=prequalification
           │      │      └─► Get list of prequalification exams
           │      │
           │      └─► GET /api/users/profiles/students/
           │             └─► Get student profile and qual_status
           │
           ├─► Display UI:
           │      │
           │      ├─► Welcome message with student name
           │      ├─► Qualification Status Card
           │      │      ├─► Status badge (Pending/Qualified/Not Qualified)
           │      │      ├─► Prequalification score
           │      │      └─► Email
           │      │
           │      ├─► Exam Cards (for each assessment):
           │      │      ├─► Title & Description
           │      │      ├─► Question count
           │      │      ├─► Total marks
           │      │      ├─► Passing marks
           │      │      ├─► Duration
           │      │      └─► "Start Exam" button
           │      │
           │      └─► Quick Stats:
           │             ├─► Available exams count
           │             ├─► Current qualification status
           │             └─► Best score
           │
           └─► Click "Start Exam" → Navigate to /prequalification-exam/[id]

┌─────────────────────────────────────────────────────────────────┐
│                         3. EXAM PAGE                             │
└─────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────┐
    │ /prequalification-exam/[id]│ Protected Route
    └─────────────┬─────────────┘
                  │
                  ├─► GET /api/assessments/[id]/
                  │      └─► Fetch full exam with questions
                  │
                  ├─► Initialize State:
                  │      ├─► answers = {} (empty object)
                  │      ├─► currentQuestionIndex = 0
                  │      └─► isSubmitting = false
                  │
                  ├─► Display UI:
                  │      │
                  │      ├─► Header:
                  │      │      ├─► Back button
                  │      │      ├─► Exam title
                  │      │      ├─► Question X of Y
                  │      │      └─► Progress percentage
                  │      │
                  │      ├─► Progress Bar:
                  │      │      └─► Visual indicator of completion
                  │      │
                  │      ├─► Question Navigation Grid:
                  │      │      └─► Buttons for each question
                  │      │             ├─► Blue = Current
                  │      │             ├─► Green = Answered
                  │      │             └─► Gray = Unanswered
                  │      │
                  │      ├─► Current Question Card:
                  │      │      ├─► Question number & marks
                  │      │      ├─► Question text
                  │      │      │
                  │      │      ├─► IF question_type = 'mcq':
                  │      │      │      └─► Radio buttons for options
                  │      │      │
                  │      │      └─► IF question_type = 'subjective':
                  │      │             └─► Textarea for answer
                  │      │
                  │      └─► Navigation:
                  │             ├─► Previous button
                  │             ├─► Answered count
                  │             ├─► Next button
                  │             └─► Submit button (on last question)
                  │
                  ├─► User Actions:
                  │      │
                  │      ├─► Answer Question:
                  │      │      └─► Update answers[questionId] = answerText
                  │      │
                  │      ├─► Navigate Questions:
                  │      │      ├─► Click grid button → Jump to question
                  │      │      ├─► Click Previous → Go back
                  │      │      └─► Click Next → Go forward
                  │      │
                  │      └─► Submit Exam:
                  │             │
                  │             ├─► Validate all questions answered
                  │             │      │
                  │             │      ├─► ❌ Missing answers
                  │             │      │      └─► Show error message
                  │             │      │
                  │             │      └─► ✅ All answered → Continue
                  │             │
                  │             ├─► Transform answers to API format:
                  │             │      {
                  │             │        assessment: id,
                  │             │        answers: [
                  │             │          { question: 1, answer_text: "..." },
                  │             │          { question: 2, answer_text: "..." }
                  │             │        ]
                  │             │      }
                  │             │
                  │             ├─► POST /api/submissions/
                  │             │      │
                  │             │      ├─► Show loading state
                  │             │      │
                  │             │      ├─► Backend processes:
                  │             │      │      ├─► Grade each answer
                  │             │      │      ├─► Calculate score
                  │             │      │      ├─► Update student qual_status
                  │             │      │      └─► Return submission with results
                  │             │      │
                  │             │      ├─► ✅ Success
                  │             │      │      └─► Redirect to /results/[submissionId]
                  │             │      │
                  │             │      └─► ❌ Error
                  │             │             └─► Display error message
                  │             │
                  │             └─► User waits for grading...

┌─────────────────────────────────────────────────────────────────┐
│                        4. RESULTS PAGE                           │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │ /results/[id]   │ Protected Route
    └────────┬────────┘
             │
             ├─► Parallel API Calls:
             │      │
             │      ├─► GET /api/submissions/[id]/
             │      │      └─► Get full submission with graded answers
             │      │
             │      └─► GET /api/users/profiles/students/
             │             └─► Get updated profile with new qual_status
             │
             ├─► Display UI:
             │      │
             │      ├─► Score Summary Card:
             │      │      │
             │      │      ├─► Trophy Icon
             │      │      ├─► Congratulations message
             │      │      │
             │      │      ├─► Three stat boxes:
             │      │      │      │
             │      │      │      ├─► Your Score:
             │      │      │      │      ├─► Percentage (color-coded)
             │      │      │      │      │      ├─► Green: ≥80%
             │      │      │      │      │      ├─► Yellow: 60-79%
             │      │      │      │      │      └─► Red: <60%
             │      │      │      │      └─► X/Y marks
             │      │      │      │
             │      │      │      ├─► Correct Answers:
             │      │      │      │      ├─► Count (X/Y)
             │      │      │      │      └─► Accuracy percentage
             │      │      │      │
             │      │      │      └─► Status:
             │      │      │             └─► Badge (Qualified/Not Qualified)
             │      │      │
             │      │      └─► Status Update Alert:
             │      │             ├─► Blue info box
             │      │             ├─► Profile updated message
             │      │             ├─► Show prequalification_score
             │      │             └─► Qualification message
             │      │
             │      ├─► Detailed Breakdown:
             │      │      │
             │      │      └─► For each answer:
             │      │             │
             │      │             ├─► Icon:
             │      │             │      ├─► ✅ Green checkmark (correct)
             │      │             │      └─► ❌ Red X (incorrect)
             │      │             │
             │      │             ├─► Question header:
             │      │             │      ├─► "Question X"
             │      │             │      └─► Badge: "Y/Z marks"
             │      │             │
             │      │             ├─► Question text
             │      │             │
             │      │             ├─► Your Answer box:
             │      │             │      └─► Gray background with answer
             │      │             │
             │      │             └─► Feedback box:
             │      │                    ├─► Green (correct) or Yellow (incorrect)
             │      │                    └─► AI reasoning text
             │      │
             │      ├─► Action Buttons:
             │      │      │
             │      │      ├─► "Back to Dashboard"
             │      │      │      └─► Navigate to /dashboard
             │      │      │
             │      │      └─► "Try Again" (if not qualified)
             │      │             └─► Navigate to /dashboard
             │      │
             │      └─► Submission Metadata:
             │             ├─► Submitted at timestamp
             │             └─► Graded at timestamp
             │
             └─► User reviews results

┌─────────────────────────────────────────────────────────────────┐
│                      5. POST-SUBMISSION                          │
└─────────────────────────────────────────────────────────────────┘

    After viewing results, user can:
    
    ├─► Return to Dashboard
    │      └─► See updated qualification status
    │             │
    │             ├─► IF qualified:
    │             │      ├─► Green badge
    │             │      └─► Can proceed with certification
    │             │
    │             └─► IF not qualified:
    │                    ├─► Red badge
    │                    └─► Can retry exam
    │
    └─► Logout
           └─► Clear tokens → Redirect to /auth

┌─────────────────────────────────────────────────────────────────┐
│                      DATA FLOW SUMMARY                           │
└─────────────────────────────────────────────────────────────────┘

Frontend State:
├─► localStorage:
│      ├─► access_token (JWT)
│      └─► refresh_token (JWT)
│
├─► Component State:
│      ├─► User data
│      ├─► Assessments list
│      ├─► Current assessment
│      ├─► Answers dictionary
│      ├─► Submission results
│      └─► Loading/error states
│
└─► URL Parameters:
       ├─► /prequalification-exam/[assessmentId]
       └─► /results/[submissionId]

API Flow:
1. POST /api/users/register/     → Create account
2. POST /api/token/               → Get JWT tokens
3. GET  /api/assessments/         → List exams
4. GET  /api/assessments/[id]/    → Get exam details
5. POST /api/submissions/         → Submit & grade exam
6. GET  /api/submissions/[id]/    → Get graded results
7. GET  /api/users/profiles/students/ → Get profile status

┌─────────────────────────────────────────────────────────────────┐
│                     ERROR HANDLING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

For each API call:
    │
    ├─► Try:
    │      ├─► Show loading state
    │      ├─► Make request
    │      └─► Process response
    │
    ├─► Catch error:
    │      │
    │      ├─► IF 401 (Unauthorized):
    │      │      ├─► Clear tokens
    │      │      └─► Redirect to /auth
    │      │
    │      ├─► IF 400 (Validation):
    │      │      └─► Display field errors
    │      │
    │      ├─► IF 404 (Not Found):
    │      │      └─► Display "Not found" message
    │      │
    │      ├─► IF 500 (Server Error):
    │      │      └─► Display "Server error" message
    │      │
    │      └─► ELSE:
    │             └─► Display generic error
    │
    └─► Finally:
           └─► Hide loading state

┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Every Protected Route:
    │
    ├─► useEffect on mount:
    │      │
    │      ├─► Check localStorage for access_token
    │      │      │
    │      │      ├─► ✅ Token exists:
    │      │      │      ├─► Set authenticated = true
    │      │      │      └─► Load page data
    │      │      │
    │      │      └─► ❌ No token:
    │      │             ├─► Set authenticated = false
    │      │             └─► Redirect to /auth
    │      │
    │      └─► Render:
    │             │
    │             ├─► IF loading: Show spinner
    │             ├─► IF !authenticated: Show nothing (redirecting)
    │             └─► ELSE: Show page content
    │
    └─► Every API call includes:
           └─► Authorization: Bearer {access_token}

┌─────────────────────────────────────────────────────────────────┐
│                         KEY FEATURES                             │
└─────────────────────────────────────────────────────────────────┘

✅ JWT Authentication
✅ Protected Routes
✅ Dynamic Question Types (MCQ/Subjective)
✅ Real-time Progress Tracking
✅ Question Navigation
✅ Form Validation
✅ Automatic Grading
✅ AI-Powered Feedback
✅ Profile Status Updates
✅ Responsive Design
✅ Error Handling
✅ Loading States
✅ Type Safety (TypeScript)

┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                            │
└─────────────────────────────────────────────────────────────────┘

Frontend:
├─► Next.js 15 (App Router)
├─► React 19
├─► TypeScript
├─► Tailwind CSS
└─► Shadcn UI Components

Backend Integration:
├─► Django REST Framework
├─► JWT Authentication
└─► RESTful API

State Management:
├─► React Hooks (useState, useEffect)
├─► URL Parameters (useParams)
└─► Router (useRouter)

Data Storage:
├─► localStorage (tokens)
└─► Component state (temporary data)
```

## 🎯 Summary

This flow diagram illustrates the complete journey of a student through the prequalification exam system, from registration to viewing results. Each step includes:

- **User actions** - What the user does
- **API calls** - Which endpoints are called
- **State changes** - How data is stored and updated
- **UI updates** - What the user sees
- **Error handling** - What happens when things go wrong
- **Navigation** - How the user moves between pages

The system is designed to be intuitive, providing clear feedback at every step while ensuring data security and validation.
