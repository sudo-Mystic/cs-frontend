import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, FileText, Award } from 'lucide-react';
import type { Assessment } from '@/lib/types';

interface ExamListProps {
    title: string;
    description: string;
    exams: Assessment[];
    type: 'daily' | 'prequalification';
    onStartExam: (id: number, type: 'daily' | 'prequalification') => void;
}

export const ExamList = ({ title, description, exams, type, onStartExam }: ExamListProps) => {
    if (exams.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No exams available</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Check back later for new assignments.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <Card
                        key={exam.id}
                        className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800"
                    >
                        <div className={`h-2 w-full ${type === 'daily' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`} />
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    {type === 'daily' ? 'Daily Test' : 'Prequalification'}
                                </Badge>
                                {exam.duration && (
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {exam.duration} mins
                                    </div>
                                )}
                            </div>
                            <CardTitle className="line-clamp-1 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {exam.title}
                            </CardTitle>
                            {exam.description && (
                                <CardDescription className="line-clamp-2 mt-1">
                                    {exam.description}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2 mb-6 text-sm">
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Questions</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{exam.questions.length}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{exam.total_marks}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pass</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{exam.passing_marks}</p>
                                </div>
                            </div>

                            <Button
                                onClick={() => onStartExam(exam.id, type)}
                                className={`w-full group-hover:translate-y-0 transition-all ${type === 'daily'
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-amber-600 hover:bg-amber-700'
                                    }`}
                            >
                                <Target className="h-4 w-4 mr-2" />
                                Start Assessment
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
