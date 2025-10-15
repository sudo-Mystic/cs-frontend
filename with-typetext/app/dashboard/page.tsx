"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, LogOut, Shield, BookOpen, Target, AlertCircle, CheckCircle, Clock, Trophy } from 'lucide-react';
import { api, tokenUtils } from '@/lib/api';
import type { Assessment, StudentProfile } from '@/lib/types';

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string>('');

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
      // Fetch prequalification assessments and student profile
      const [assessmentsData, profileData] = await Promise.all([
        api.getAssessments('prequalification'),
        api.getStudentProfile(),
      ]);
      
      setAssessments(assessmentsData);
      setStudentProfile(profileData);
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

  const handleStartExam = (assessmentId: number) => {
    router.push(`/prequalification-exam/${assessmentId}`);
  };

  const getQualificationStatusBadge = (status: string) => {
    switch (status) {
      case 'qualified':
        return (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Qualified</span>
          </div>
        );
      case 'not_qualified':
        return (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Not Qualified</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Pending</span>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudseals-blue mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img
                src="/images/cloudseals-logo-white-bg.png"
                alt="CloudSeals Logo"
                className="h-10 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CloudSeals Dashboard
              </h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {studentProfile?.user?.first_name || 'Student'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and continue your cloud certification journey
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Status Card */}
        {studentProfile && (
          <Card className="mb-6 border-l-4 border-l-cloudseals-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-cloudseals-blue" />
                <span>Qualification Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  {getQualificationStatusBadge(studentProfile.qual_status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prequalification Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {studentProfile.prequalification_score !== null 
                      ? `${studentProfile.prequalification_score}%` 
                      : 'Not taken'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {studentProfile.user?.email || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prequalification Exams */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Prequalification Exams
          </h3>
          
          {assessments.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No prequalification exams available at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-cloudseals-blue" />
                      <span>{assessment.title}</span>
                    </CardTitle>
                    {assessment.description && (
                      <CardDescription>{assessment.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {assessment.questions.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Marks:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {assessment.total_marks}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Passing Marks:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {assessment.passing_marks}
                        </span>
                      </div>
                      {assessment.duration && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {assessment.duration} mins
                          </span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleStartExam(assessment.id)}
                      className="w-full bg-cloudseals-blue hover:bg-cloudseals-purple transition-colors"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Start Exam
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assessments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualification Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {studentProfile?.qual_status?.replace('_', ' ') || 'Pending'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentProfile && studentProfile.prequalification_score !== null 
                  ? `${studentProfile.prequalification_score}%` 
                  : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;