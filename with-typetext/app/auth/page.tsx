"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sun, Moon, CheckCircle, BookOpen, Target, AlertCircle, Eye, EyeOff } from "lucide-react"
import { TypingEffect } from "@/components/typing-effect"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    country_code: "",
    phone: "",
    designation: "",
    password: "",
    confirm_password: "",
  })

  const toggleShowLoginPassword = () => setShowLoginPassword((prev) => !prev)
  const toggleShowRegisterPassword = () => setShowRegisterPassword((prev) => !prev)
  const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store tokens in localStorage
        localStorage.setItem("access_token", data.access)
        localStorage.setItem("refresh_token", data.refresh)
        
        setSuccess("Login successful! Redirecting...")
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setError(data.detail || data.message || "Invalid credentials. Please try again.")
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Client-side validation
    if (registerData.password !== registerData.confirm_password) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!registerData.country_code) {
      setError("Country code cannot be empty.")
      setIsLoading(false)
      return
    }

    if (!/^\d+$/.test(registerData.country_code)) {
      setError("Country code must contain only numbers.")
      setIsLoading(false)
      return
    }

    if (!registerData.phone) {
      setError("Phone number cannot be empty.")
      setIsLoading(false)
      return
    }

    if (!/^\d+$/.test(registerData.phone)) {
      setError("Phone number must contain only numbers.")
      setIsLoading(false)
      return
    }

    if (!registerData.designation) {
      setError("Please select a designation")
      setIsLoading(false)
      return
    }

    try {
      const fullPhoneNumber = registerData.country_code + registerData.phone;
      const response = await fetch("http://localhost:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registerData.email,
          username: registerData.username,
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          phone: fullPhoneNumber,
          designation: registerData.designation,
          password: registerData.password,
          confirm_password: registerData.confirm_password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Registration successful! Please log in with your credentials.")
        // Reset form
        setRegisterData({
          email: "",
          username: "",
          first_name: "",
          last_name: "",
          country_code: "",
          phone: "",
          designation: "",
          password: "",
          confirm_password: "",
        })
        // Switch to login form after a short delay
        setTimeout(() => {
          setIsLogin(true)
          setSuccess("")
        }, 2000)
      } else {
        // Handle validation errors
        if (data.username && Array.isArray(data.username)) {
          setError(`Username: ${data.username[0]}`)
        } else if (data.username) {
          setError(`Username: ${data.username}`)
        } else if (data.email && Array.isArray(data.email)) {
          setError(`Email: ${data.email[0]}`)
        } else if (data.email) {
          setError(`Email: ${data.email}`)
        } else if (data.password && Array.isArray(data.password)) {
          setError(`Password: ${data.password[0]}`)
        } else if (data.password) {
          setError(`Password: ${data.password}`)
        } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          setError(data.non_field_errors[0])
        } else if (data.non_field_errors) {
          setError(data.non_field_errors)
        } else {
          setError("Registration failed. Please check your information and try again.")
        }
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchToRegister = () => {
    setIsLogin(false)
    setError("")
    setSuccess("")
  }

  const switchToLogin = () => {
    setIsLogin(true)
    setError("")
    setSuccess("")
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div
      className={`min-h-screen w-full md:grid md:grid-cols-2 lg:grid-cols-5 transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}
    >
      {/* Left Column: Branding */}
      <div className="hidden md:flex lg:col-span-2 bg-gradient-to-br from-cloudseals-blue to-cloudseals-purple p-8 lg:p-12 text-white flex-col justify-between">
        <div>
          <div className="mb-6">
            <img
              src={isDarkMode ? "/images/cloudseals-logo-black-bg-full.png" : "/images/cloudseals-logo-white-bg.png"}
              alt="CloudSeals Logo"
              className="h-32 w-auto mb-4"
            />
          </div>
          <div className="text-lg text-blue-100 max-w-lg font-opensans leading-relaxed">
            <p className="mb-4 text-xl font-bold">Master the cloud with industry-leading certifications in</p>
            <TypingEffect
              words={["Microsoft Azure", "Amazon Web Services", "Google Cloud Platform"]}
              className="text-cloudseals-lightblue font-bold text-2xl block"
            />
          </div>
        </div>
        <div className="mt-8 space-y-3"> 
          <div className="flex items-center space-x-3 text-lg text-blue-100 font-opensans">
            <CheckCircle className="h-6 w-6 text-cloudseals-lightblue flex-shrink-0" />
            <span>Track your progress</span>
          </div>
          <div className="flex items-center space-x-3 text-lg text-blue-100 font-opensans">
            <BookOpen className="h-6 w-6 text-cloudseals-lightblue flex-shrink-0" />
            <span>Access your courses</span>
          </div>
          <div className="flex items-center space-x-3 text-lg text-blue-100 font-opensans">
            <Target className="h-6 w-6 text-cloudseals-lightblue flex-shrink-0" />
            <span>Achieve your goals</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-blue-200 mb-4 font-opensans">Powered by leading cloud technologies</p>
          <div className="flex items-center space-x-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
              alt="AWS Logo"
              className="h-8 opacity-80"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg"
              alt="GCP Logo"
              className="h-8 opacity-80"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg"
              alt="Azure Logo"
              className="h-8 opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div
        className={`lg:col-span-3 flex flex-col items-center justify-center p-4 relative transition-colors duration-300 ${
          isDarkMode ? "bg-cloudseals-dark bg-grid-pattern bg-grid" : "bg-gray-50 bg-grid-pattern-light bg-grid"
        }`}
      >
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${
            isDarkMode ? "text-gray-400 hover:bg-gray-700/50" : "text-gray-600 hover:bg-gray-200/50"
          }`}
        >
          {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        <div className="w-full max-w-md relative">
          {/* Login Form */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              isLogin ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute pointer-events-none"
            }`}
          >
            <div
              className={`backdrop-blur-sm rounded-2xl shadow-2xl p-8 border transition-colors duration-300 ${
                isDarkMode ? "bg-gray-900/80 border-gray-700" : "bg-white/85 border-gray-200"
              }`}
            >
              <div className="text-center mb-8">
                <h1
                  className={`text-4xl font-poppins font-bold mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  CloudSeals
                </h1>
                <h2
                  className={`text-xl font-poppins font-semibold transition-colors duration-300 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  AI Assessment Platform
                </h2>
                <p
                  className={`text-sm mt-2 font-opensans transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Sign in to accelerate your cloud journey
                </p>
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-500 text-sm font-opensans">{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-green-500 text-sm font-opensans">{success}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="login-username"
                    className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="login-username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg font-opensans transition-all duration-300 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                        : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                    }`}
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="login-password"
                    className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showLoginPassword ? "text" : "password"}
                      autoComplete="new-password"
                      id="login-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className={`w-full px-4 py-3 pr-12 rounded-lg font-opensans transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                          : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={toggleShowLoginPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg text-lg font-poppins font-semibold bg-cloudseals-blue hover:bg-cloudseals-purple transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing In..." : "Login"}
                </Button>
              </form>

              <p
                className={`text-center mt-6 text-sm font-opensans transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Don't have an account?{" "}
                <button
                  onClick={switchToRegister}
                  className="font-semibold text-cloudseals-lightblue hover:text-cloudseals-green transition-colors"
                >
                  Register Now
                </button>
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              !isLogin ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute pointer-events-none"
            }`}
          >
            <div
              className={`backdrop-blur-sm rounded-2xl shadow-2xl p-8 border transition-colors duration-300 ${
                isDarkMode ? "bg-gray-900/80 border-gray-700" : "bg-white/85 border-gray-200"
              }`}
            >
              <div className="text-center mb-8">
                <h1
                  className={`text-4xl font-poppins font-bold mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  CloudSeals
                </h1>
                <h2
                  className={`text-xl font-poppins font-semibold transition-colors duration-300 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Create Your Account
                </h2>
                <p
                  className={`text-sm mt-2 font-opensans transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Begin your path to cloud mastery
                </p>
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-500 text-sm font-opensans">{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-green-500 text-sm font-opensans">{success}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="reg-firstname"
                      className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      First Name
                    </Label>
                    <Input
                      type="text"
                      id="reg-firstname"
                      value={registerData.first_name}
                      onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg font-opensans transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                          : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                      }`}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="reg-lastname"
                      className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      id="reg-lastname"
                      value={registerData.last_name}
                      onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg font-opensans transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                          : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="reg-username"
                    className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="reg-username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg font-opensans transition-all duration-300 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                        : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                    }`}
                    placeholder="john.doe"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="reg-email"
                    className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    id="reg-email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg font-opensans transition-all duration-300 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                        : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                    }`}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <div className="flex space-x-2">
                    <div className="w-1/4">
                      <Label
                        htmlFor="reg-country-code"
                        className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Country Pin
                      </Label>
                      <Input
                        type="text"
                        id="reg-country-code"
                        value={registerData.country_code}
                        onChange={(e) => setRegisterData({ ...registerData, country_code: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg font-opensans transition-all duration-300 ${
                          isDarkMode
                            ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                            : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                        }`}
                        placeholder="91"
                        maxLength={4}
                      />
                    </div>
                    <div className="w-3/4">
                      <Label
                        htmlFor="reg-phone"
                        className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        id="reg-phone"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg font-opensans transition-all duration-300 ${
                          isDarkMode
                            ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                            : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                        }`}
                        placeholder="123-456-7890"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="reg-designation"
                    className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Designation
                  </Label>
                  <Select onValueChange={(value) => setRegisterData({ ...registerData, designation: value })}>
                    <SelectTrigger
                      className={`w-full px-4 py-3 rounded-lg font-opensans transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white focus:border-cloudseals-blue"
                          : "bg-gray-100 border-gray-300 text-gray-900 focus:border-cloudseals-blue"
                      }`}
                    >
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}>
                      <SelectItem
                        value="student"
                        className={isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"}
                      >
                        Student
                      </SelectItem>
                      <SelectItem
                        value="trainer"
                        className={isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"}
                      >
                        Trainer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="reg-password"
                    className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showRegisterPassword ? "text" : "password"}
                      autoComplete="new-password"
                      id="reg-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className={`w-full px-4 py-3 pr-12 rounded-lg font-opensans transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                          : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={toggleShowRegisterPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="reg-confirm-password"
                    className={`block mb-2 text-sm font-medium font-opensans transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      id="reg-confirm-password"
                      value={registerData.confirm_password}
                      onChange={(e) => setRegisterData({ ...registerData, confirm_password: e.target.value })}
                      className={`w-full px-4 py-3 pr-12 rounded-lg font-opensans transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-cloudseals-blue"
                          : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-cloudseals-blue"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={toggleShowConfirmPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg text-lg font-poppins font-semibold bg-cloudseals-blue hover:bg-cloudseals-purple transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <p
                className={`text-center mt-6 text-sm font-opensans transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Already have an account?{" "}
                <button
                  onClick={switchToLogin}
                  className="font-semibold text-cloudseals-lightblue hover:text-cloudseals-green transition-colors"
                >
                  Login Here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
