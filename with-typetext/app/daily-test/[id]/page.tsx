"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertCircle, CheckCircle, BookOpen, Send } from 'lucide-react';
import { api } from '@/lib/api';
import type { Assessment, Question, AnswerInput } from '@/lib/types';

const DailyTestPage = () => {
  const router = useRouter();
  const params = useParams();
  const assessmentId = parseInt(params.id as string);

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    loadAssessment();
  }, [assessmentId]);

  useEffect(() => {
    if (assessment?.duration && timeRemaining === null) {
      setTimeRemaining(assessment.duration * 60); // Convert minutes to seconds
    }
  }, [assessment]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const loadAssessment = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await api.getAssessmentById(assessmentId);
      setAssessment(data);
    } catch (err) {
      console.error('Error loading assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answerText: string) => {
    setAnswers(prev => new Map(prev).set(questionId, answerText));
  };

  const handleNext = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!assessment) return;

    setIsSubmitting(true);
    setError('');

    try {
      const answersArray: AnswerInput[] = Array.from(answers.entries()).map(([questionId, answerText]) => ({
        question: questionId,
        answer_text: answerText,
      }));

      const submission = await api.submitAnswers({
        assessment: assessmentId,
        answers: answersArray,
      });

      // Redirect to results page
      router.push(`/results/${submission.id}`);
    } catch (err) {
      console.error('Error submitting test:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit test');
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!assessment) return 0;
    return ((currentQuestionIndex + 1) / assessment.questions.length) * 100;
  };

  const getAnsweredCount = (): number => {
    return answers.size;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading test...</div>
        </div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) return null;

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const currentAnswer = answers.get(currentQuestion.id) || '';
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assessment.title}
                </h1>
                {assessment.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {assessment.description}
                  </p>
                )}
              </div>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center space-x-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className={timeRemaining < 60 ? 'text-red-600' : 'text-gray-900 dark:text-white'}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
              <span>{getAnsweredCount()} answered</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Question Card */}
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Question {currentQuestionIndex + 1}</span>
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {currentQuestion.marks} marks
              </span>
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {currentQuestion.question_text}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentQuestion.question_type === 'mcq' && currentQuestion.options ? (
              <RadioGroup
                value={currentAnswer}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[150px] resize-y"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Previous
          </Button>

          <div className="flex space-x-3">
            {!isLastQuestion ? (
              <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                Next Question
              </Button>
            ) : (
              <Button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Test'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation Grid */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Question Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {assessment.questions.map((question, index) => {
                const isAnswered = answers.has(question.id);
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`
                      h-10 w-10 rounded-md font-semibold transition-all
                      ${isCurrent
                        ? 'bg-green-600 text-white ring-2 ring-green-400 ring-offset-2'
                        : isAnswered
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }
                      hover:ring-2 hover:ring-green-400 hover:ring-offset-1
                    `}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyTestPage;
