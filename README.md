# Cloudseals Frontend Application

This repository contains the frontend application for Cloudseals, built with Next.js and designed to provide a modern, responsive, and intuitive user experience. It features a robust authentication system, a dynamic dashboard, and a rich set of UI components for a seamless interaction.

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
    # or using pnpm (as indicated by pnpm-lock.yaml)
    pnpm install
    ```


## Usage Instructions

To run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

To build the application for production:

```bash
npm run build
# or
pnpm build
```

To start the production server:

```bash
npm run start
# or
pnpm start
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
