"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Trophy, 
  Target,
  ArrowLeft,
  FileText,
  Award,
  TrendingUp,
  Home,
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Submission, StudentProfile } from '@/lib/types';

const ResultsPage = () => {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id ? parseInt(params.id as string) : null;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!submissionId) {
      setError('Invalid submission ID');
      setIsLoading(false);
      return;
    }

    loadResults();
  }, [submissionId]);

  const loadResults = async () => {
    if (!submissionId) return;

    setIsLoading(true);
    setError('');

    try {
      const [submissionData, profileData] = await Promise.all([
        api.getSubmissionById(submissionId),
        api.getStudentProfile(),
      ]);
      
      setSubmission(submissionData);
      setStudentProfile(profileData);
    } catch (err) {
      console.error('Error loading results:', err);
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setIsLoading(false);
    }
  };

  const getQualificationStatusBadge = (status: string) => {
    switch (status) {
      case 'qualified':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-lg">
            <CheckCircle className="h-5 w-5 mr-2" />
            Qualified
          </Badge>
        );
      case 'not_qualified':
        return (
          <Badge variant="destructive" className="px-4 py-2 text-lg">
            <XCircle className="h-5 w-5 mr-2" />
            Not Qualified
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="px-4 py-2 text-lg">
            <AlertCircle className="h-5 w-5 mr-2" />
            Pending
          </Badge>
        );
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudseals-blue mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading results...</div>
        </div>
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <span>Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!submission) return null;

  const correctAnswers = submission.correct_answers || 0;
  const totalQuestions = submission.total_questions || 0;
  const percentage = submission.score || 0; // Backend returns percentage as 'score'

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Exam Results
              </h1>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary Card */}
        <Card className="mb-8 border-l-4 border-l-cloudseals-blue">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-cloudseals-blue/10 p-6">
                <Trophy className="h-16 w-16 text-cloudseals-blue" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">
              Congratulations on Completing the Exam!
            </CardTitle>
            <CardDescription className="text-lg">
              Here are your results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Award className="h-8 w-8 mx-auto mb-2 text-cloudseals-blue" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Score</p>
                <p className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                  {percentage?.toFixed(1) || '0.0'}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {correctAnswers} / {totalQuestions} correct
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-cloudseals-blue" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Correct Answers</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {correctAnswers}/{totalQuestions}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(0) : '0'}% accuracy
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-cloudseals-blue" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Submission Status</p>
                <div className="flex justify-center mt-2">
                  {submission.status === 'graded' ? (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Graded
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="px-4 py-2">
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {studentProfile && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      Qualification Status Updated
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      Your profile has been updated with your prequalification score of{' '}
                      <strong>{percentage?.toFixed(1) || '0.0'}%</strong>.
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-sm text-blue-800 dark:text-blue-200">Qualification Status:</span>
                      {studentProfile.qual_status === 'qualified' ? (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Qualified
                        </Badge>
                      ) : studentProfile.qual_status === 'not_qualified' ? (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Qualified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                      {studentProfile.qual_status === 'qualified' && (
                        <span>✓ You are now qualified to proceed with the full certification program!</span>
                      )}
                      {studentProfile.qual_status === 'not_qualified' && (
                        <span>Keep practicing and try again to achieve qualification!</span>
                      )}
                      {studentProfile.qual_status === 'pending' && (
                        <span>Your qualification status is being reviewed.</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Answer Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-cloudseals-blue" />
              <span>Detailed Answer Breakdown</span>
            </CardTitle>
            <CardDescription>
              Review your answers and see where you can improve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {submission.answers?.map((answer, index) => (
                <div key={answer.id}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {answer.is_correct ? (
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2">
                          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Question {index + 1}
                        </h3>
                        <Badge variant={answer.is_correct ? "default" : "secondary"}>
                          {answer.marks_obtained} / {answer.question.marks} marks
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {answer.question.question_text}
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Your Answer:
                        </p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {answer.answer_text}
                        </p>
                      </div>
                      
                      {answer.reasoning && (
                        <div className={`rounded-lg p-4 ${
                          answer.is_correct 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                        }`}>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Feedback:
                          </p>
                          <p className={`text-sm ${
                            answer.is_correct 
                              ? 'text-green-800 dark:text-green-200' 
                              : 'text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {answer.reasoning}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < (submission.answers?.length || 0) - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            size="lg"
            className="bg-cloudseals-blue hover:bg-cloudseals-purple"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          
          {studentProfile?.qual_status === 'not_qualified' && (
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              variant="outline"
            >
              <Target className="h-5 w-5 mr-2" />
              Try Again
            </Button>
          )}
        </div>

        {/* Submission Metadata */}
        <Card className="mt-8 bg-gray-50 dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Submitted At:</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Graded At:</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {submission.graded_at ? new Date(submission.graded_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ResultsPage;
