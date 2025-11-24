import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Shield, Trophy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
    qualStatus: string;
    dailyTestsCount: number;
    assessmentsCount: number;
    batch: string | null | undefined;
    prequalificationScore: number | null;
}

export const StatsCards = ({
    qualStatus,
    dailyTestsCount,
    assessmentsCount,
    batch,
    prequalificationScore,
}: StatsCardsProps) => {
    const isQualified = qualStatus === 'qualified';

    if (isQualified) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Available Tests"
                    value={dailyTestsCount}
                    subtitle="Daily assignments"
                    icon={BookOpen}
                    color="blue"
                />
                <StatsCard
                    title="Batch Status"
                    value={batch || 'Pending'}
                    subtitle={batch ? 'Active enrollment' : 'Awaiting assignment'}
                    icon={Shield}
                    color="purple"
                />
                <StatsCard
                    title="Certification"
                    value="Active"
                    subtitle="Track in progress"
                    icon={Trophy}
                    color="amber"
                />
                <StatsCard
                    title="Completed"
                    value="0"
                    subtitle="Tests finished"
                    icon={CheckCircle}
                    color="emerald"
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
                title="Available Exams"
                value={assessmentsCount}
                subtitle="Prequalification"
                icon={BookOpen}
                color="blue"
            />
            <StatsCard
                title="Status"
                value={qualStatus.replace('_', ' ')}
                subtitle="Qualification"
                icon={qualStatus === 'pending' ? Clock : AlertCircle}
                color={qualStatus === 'pending' ? 'amber' : 'red'}
                capitalizeValue
            />
            <StatsCard
                title="Best Score"
                value={prequalificationScore != null ? `${Number(prequalificationScore).toFixed(1)}%` : 'N/A'}
                subtitle="Latest attempt"
                icon={Trophy}
                color="emerald"
            />
        </div>
    );
};

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    color: 'blue' | 'purple' | 'amber' | 'emerald' | 'red';
    capitalizeValue?: boolean;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, color, capitalizeValue }: StatsCardProps) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                        <div className="mt-2 flex items-baseline">
                            <span className={cn("text-2xl font-bold text-gray-900 dark:text-white", capitalizeValue && "capitalize")}>
                                {value}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
                    </div>
                    <div className={cn("p-3 rounded-xl", colorStyles[color])}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
