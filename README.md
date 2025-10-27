# Cloudseals Frontend Application

This repository contains the frontend application for Cloudseals, built with Next.js and designed to provide a modern, responsive, and intuitive user experience. It features a robust authentication system, a dynamic dashboard, and a rich set of UI components for a seamless interaction.

## Quick Start

```bash
# Navigate to project directory
cd with-typetext

# Install dependencies (using pnpm - recommended)
pnpm install

# Create environment file
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local

# Start development server
pnpm dev

# Open http://localhost:3000 in your browser
```

**Note**: Ensure your backend API is running on `http://localhost:8000` before starting the frontend.

## Technologies Used

*   **Framework**: Next.js (React Framework)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui (built on Radix UI)
*   **Form Management**: React Hook Form with Zod validation
*   **Charting**: Recharts
*   **Icons**: Lucide React
*   **Theming**: Next-Themes
*   **Other Libraries**:
    *   `geist`: Modern typeface for the UI.
    *   `sonner`: For elegant toast notifications.
    *   `vaul`: For unstyled, accessible, and performant dialogs.
    *   `embla-carousel-react`: For carousels.
    *   `input-otp`: For OTP input fields.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js**: Version 18 or higher ([Download Node.js](https://nodejs.org/))
*   **Package Manager**: npm (comes with Node.js) or pnpm (recommended)
*   **Backend API**: The backend server must be running on `http://localhost:8000` (or configure a different URL)

To install pnpm globally (recommended):
```bash
npm install -g pnpm
```

## Installation Instructions

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sudo-Mystic/cs-frontend.git
    cd cs-frontend/with-typetext
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or using pnpm (recommended, as indicated by pnpm-lock.yaml)
    pnpm install
    ```

3.  **Set up environment variables**:
    
    Create a `.env.local` file in the `with-typetext` directory with the following content:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ```
    
    **Note**: Change the URL if your backend API is hosted elsewhere (e.g., `https://api.example.com`)


## Usage Instructions

### Running the Development Server

**Important**: Ensure your backend API is running before starting the frontend.

1.  Start the development server:
    ```bash
    npm run dev
    # or
    pnpm dev
    ```

2.  Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

3.  The application will automatically reload when you make changes to the code.

### Building for Production

1.  Build the application:
    ```bash
    npm run build
    # or
    pnpm build
    ```

2.  Start the production server:
    ```bash
    npm run start
    # or
    pnpm start
    ```

3.  The production build will be optimized for performance and available at [http://localhost:3000](http://localhost:3000)

### Linting the Code

To check code quality and fix issues:
```bash
npm run lint
# or
pnpm lint
```

## Project Structure Overview

```
with-typetext/
├── app/                  # Next.js app directory for routing and pages
│   ├── auth/             # Authentication-related pages (e.g., login, signup)
│   │   └── page.tsx
│   ├── dashboard/        # Dashboard pages
│   │   └── page.tsx
│   ├── globals.css       # Global CSS styles
│   ├── layout.tsx        # Root layout for the application
│   └── page.tsx          # Main landing page
├── components/           # Reusable React components
│   ├── ui/               # shadcn/ui components (accordion, button, dialog, etc.)
│   │   └── ...
│   ├── theme-provider.tsx# Context provider for theme switching
│   └── typing-effect.tsx # Custom typing animation component
├── hooks/                # Custom React hooks
│   └── use-mobile.tsx    # Hook for mobile detection
│   └── use-toast.ts      # Hook for toast notifications
├── lib/                  # Utility functions
│   └── utils.ts          # General utility functions (e.g., for `clsx`, `tailwind-merge`)
├── public/               # Static assets (images, fonts, etc.)
│   ├── images/           # Cloudseals logos and other images
│   │   └── ...
│   └── ...
├── styles/               # Additional stylesheets
│   └── globals.css
├── .gitignore            # Files ignored by Git
├── components.json       # shadcn/ui configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies and scripts
├── package-lock.json     # npm lock file
├── pnpm-lock.yaml        # pnpm lock file
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Backend Requirements

This frontend application requires a backend API to function properly. The backend should:

*   Be running and accessible (default: `http://localhost:8000`)
*   Provide the following API endpoints:
    *   `POST /api/users/register/` - User registration
    *   `POST /api/token/` - User login (JWT authentication)
    *   `GET /api/assessments/` - List assessments
    *   `GET /api/assessments/{id}/` - Get specific assessment
    *   `POST /api/submissions/` - Submit exam answers
    *   `GET /api/submissions/{id}/` - Get submission results
    *   `GET /api/users/profiles/students/` - Get student profile
*   Support CORS for `http://localhost:3000`

For backend setup instructions, refer to your backend repository documentation.

## Testing the Application

Once both the frontend and backend are running, you can test the application:

1.  **Register a new account**:
    *   Navigate to [http://localhost:3000/auth](http://localhost:3000/auth)
    *   Click "Register Now"
    *   Fill in all required fields and submit

2.  **Login**:
    *   Enter your credentials on the auth page
    *   You should be redirected to the dashboard upon successful login

3.  **Explore the dashboard**:
    *   View your profile information
    *   See available prequalification exams
    *   Start an exam to test the full workflow

## Troubleshooting

### Common Issues and Solutions

**Issue: Cannot start the development server**
```bash
# Solution: Clean the Next.js cache and restart
rm -rf .next
npm run dev  # or pnpm dev
```

**Issue: "Cannot connect to API" or CORS errors**
*   **Check if the backend is running**: Open `http://localhost:8000/api/` in your browser
*   **Verify environment variables**: Make sure `.env.local` exists with the correct `NEXT_PUBLIC_API_BASE_URL`
*   **Check CORS settings**: Ensure your backend allows requests from `http://localhost:3000`

**Issue: Authentication errors or "401 Unauthorized"**
```javascript
// Solution: Clear stored tokens and login again
// Open browser console (F12) and run:
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
// Then navigate to /auth and login again
```

**Issue: TypeScript errors**
```bash
# Solution: Rebuild the project
npm run build  # or pnpm build
```

**Issue: Dependencies not installed or version conflicts**
```bash
# Solution: Clean install dependencies
rm -rf node_modules package-lock.json
npm install  # or: rm -rf node_modules pnpm-lock.yaml && pnpm install
```

## Available Scripts

In the `with-typetext` directory, you can run:

*   `npm run dev` or `pnpm dev` - Starts the development server on port 3000
*   `npm run build` or `pnpm build` - Creates an optimized production build
*   `npm run start` or `pnpm start` - Starts the production server
*   `npm run lint` or `pnpm lint` - Runs ESLint to check code quality

## Additional Documentation

For more detailed information, see:

*   [SETUP_GUIDE.md](with-typetext/SETUP_GUIDE.md) - Comprehensive setup and testing guide
*   [QUICK_REFERENCE.md](with-typetext/QUICK_REFERENCE.md) - Quick reference card for developers
*   [FLOW_DIAGRAM.md](with-typetext/FLOW_DIAGRAM.md) - User flow and architecture diagrams

## Contributing

Contributions are welcome! Please follow these guidelines:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/your-feature`)
3.  Commit your changes (`git commit -m 'Add some feature'`)
4.  Push to the branch (`git push origin feature/your-feature`)
5.  Open a Pull Request

## Support

If you encounter any issues or have questions:

1.  Check the [Troubleshooting](#troubleshooting) section above
2.  Review the additional documentation in the `with-typetext` directory
3.  Open an issue on GitHub with detailed information about your problem

## License

This project is private and proprietary. Unauthorized copying or distribution is prohibited.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
