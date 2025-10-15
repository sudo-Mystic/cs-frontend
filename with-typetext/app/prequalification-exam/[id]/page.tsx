"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Send,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Assessment, AnswerInput } from '@/lib/types';

const PrequalificationExamPage = () => {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id ? parseInt(params.id as string) : null;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!assessmentId) {
      setError('Invalid assessment ID');
      setIsLoading(false);
      return;
    }

    loadAssessment();
  }, [assessmentId]);

  const loadAssessment = async () => {
    if (!assessmentId) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await api.getAssessmentById(assessmentId);
      setAssessment(data);
    } catch (err) {
      console.error('Error loading assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answerText: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerText }));
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    // Validate all questions are answered
    const unansweredQuestions = assessment.questions.filter(
      q => !answers[q.id] || answers[q.id].trim() === ''
    );

    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const submissionPayload = {
        assessment: assessment.id,
        answers: Object.entries(answers).map(([questionId, answerText]) => ({
          question: parseInt(questionId),
          answer_text: answerText,
        })),
      };

      const submission = await api.submitAnswers(submissionPayload);
      
      // Redirect to results page
      router.push(`/results/${submission.id}`);
    } catch (err) {
      console.error('Error submitting exam:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit exam. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    if (!assessment) return 0;
    const answeredCount = assessment.questions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length;
    return (answeredCount / assessment.questions.length) * 100;
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goToNextQuestion = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudseals-blue mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading exam...</div>
        </div>
      </div>
    );
  }

  if (error && !assessment) {
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

  if (!assessment) return null;

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {assessment.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {assessment.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 inline mr-1" />
                Progress: {Math.round(getProgressPercentage())}%
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Question Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Question Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {assessment.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(index)}
                  disabled={isSubmitting}
                  className={`
                    w-10 h-10 rounded-lg font-semibold transition-all
                    ${index === currentQuestionIndex 
                      ? 'bg-cloudseals-blue text-white ring-2 ring-cloudseals-blue ring-offset-2' 
                      : answers[q.id] && answers[q.id].trim() !== ''
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-cloudseals-blue" />
                <span>Question {currentQuestionIndex + 1}</span>
              </div>
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
              </span>
            </CardTitle>
            <CardDescription className="text-base text-gray-900 dark:text-gray-100 mt-4">
              {currentQuestion.question_text}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.question_type === 'mcq' && currentQuestion.options ? (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                disabled={isSubmitting}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value={option} id={`q${currentQuestion.id}-opt${index}`} />
                    <Label 
                      htmlFor={`q${currentQuestion.id}-opt${index}`}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div>
                <Label htmlFor={`answer-${currentQuestion.id}`} className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Your Answer:
                </Label>
                <Textarea
                  id={`answer-${currentQuestion.id}`}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  disabled={isSubmitting}
                  className="w-full resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Provide a detailed answer to this question.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0 || isSubmitting}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Object.keys(answers).filter(k => answers[parseInt(k)] && answers[parseInt(k)].trim() !== '').length} of {assessment.questions.length} answered
          </div>

          {currentQuestionIndex === assessment.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Exam
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === assessment.questions.length - 1 || isSubmitting}
            >
              Next
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          )}
        </div>

        {/* Submit Button (also at bottom for convenience) */}
        {currentQuestionIndex !== assessment.questions.length - 1 && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Exam
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              You can submit the exam from any question
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PrequalificationExamPage;
