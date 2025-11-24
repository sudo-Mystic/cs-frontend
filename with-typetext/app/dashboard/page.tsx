"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, tokenUtils } from '@/lib/api';
import type { Assessment, StudentProfile } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ExamList } from '@/components/dashboard/exam-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Mail, Phone, CheckCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [dailyTests, setDailyTests] = useState<Assessment[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string>('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth');
      return;
    }
    setIsAuthenticated(true);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Fetch student profile first to determine qualification status
      const profileData = await api.getStudentProfile();
      setStudentProfile(profileData);

      // Load different assessments based on qualification status
      if (profileData.qual_status === 'qualified') {
        // Qualified students see daily tests
        const dailyTestsData = await api.getAssessments('daily');
        setDailyTests(dailyTestsData);
        setAssessments([]); // Clear prequalification exams
      } else {
        // Non-qualified students see prequalification exams
        const assessmentsData = await api.getAssessments('prequalification');
        setAssessments(assessmentsData);
        setDailyTests([]); // Clear daily tests
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    tokenUtils.clearTokens();
    router.push('/auth');
  };

  const handleStartExam = (assessmentId: number, examType: 'prequalification' | 'daily') => {
    if (examType === 'daily') {
      router.push(`/daily-test/${assessmentId}`);
    } else {
      router.push(`/prequalification-exam/${assessmentId}`);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        user={studentProfile?.user || null}
        onProfileClick={() => setShowProfile(!showProfile)}
        onLogoutClick={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Modal/Section */}
        {showProfile && studentProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-2xl shadow-2xl border-none animate-in zoom-in-95 duration-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <UserCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {studentProfile.user.first_name} {studentProfile.user.last_name}
                      </p>
                      <p className="text-sm font-normal text-white/80">
                        @{studentProfile.user.username}
                      </p>
                    </div>
                  </CardTitle>
                  <Button
                    onClick={() => setShowProfile(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-b-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Info</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                          <Mail className="h-5 w-5 text-blue-500" />
                          <span>{studentProfile.user.email}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                          <Phone className="h-5 w-5 text-blue-500" />
                          <span>{studentProfile.phone || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h3>
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Student ID</span>
                          <span className="font-mono font-medium">#{studentProfile.id.toString().padStart(6, '0')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Member Since</span>
                          <span className="font-medium">{formatDate(studentProfile.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Academic Status</h3>
                      <div className={`p-4 rounded-lg border ${studentProfile.qual_status === 'qualified'
                          ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900'
                          : 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900'
                        }`}>
                        <div className="flex items-center space-x-3 mb-2">
                          {studentProfile.qual_status === 'qualified' ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Clock className="h-6 w-6 text-amber-600" />
                          )}
                          <span className={`text-lg font-bold capitalize ${studentProfile.qual_status === 'qualified' ? 'text-green-700' : 'text-amber-700'
                            }`}>
                            {studentProfile.qual_status.replace('_', ' ')}
                          </span>
                        </div>
                        {studentProfile.prequalification_score !== null && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Latest Score</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {Number(studentProfile.prequalification_score).toFixed(1)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {studentProfile?.user?.first_name}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {studentProfile?.qual_status === 'qualified'
              ? "You're doing great! Keep up with your daily tests."
              : "Ready to start your journey? Complete the prequalification exam."
            }
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        {studentProfile && (
          <div className="animate-in slide-in-from-bottom-6 duration-500 delay-100">
            <StatsCards
              qualStatus={studentProfile.qual_status}
              dailyTestsCount={dailyTests.length}
              assessmentsCount={assessments.length}
              batch={studentProfile.batch}
              prequalificationScore={studentProfile.prequalification_score}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="animate-in slide-in-from-bottom-8 duration-500 delay-200">
          {studentProfile?.qual_status === 'qualified' ? (
            <>
              <Alert className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-900">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 dark:text-blue-300 font-semibold">Certification Track Active</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                  You have successfully qualified! Complete your daily assignments to maintain your streak.
                </AlertDescription>
              </Alert>

              <ExamList
                title="Daily Assignments"
                description="Practice tests assigned to your batch"
                exams={dailyTests}
                type="daily"
                onStartExam={handleStartExam}
              />
            </>
          ) : (
            <ExamList
              title="Prequalification Exams"
              description="Complete these exams to qualify for the certification program"
              exams={assessments}
              type="prequalification"
              onStartExam={handleStartExam}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;