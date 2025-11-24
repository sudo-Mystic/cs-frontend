import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
    user: {
        first_name: string;
        last_name: string;
        username: string;
    } | null;
    onProfileClick: () => void;
    onLogoutClick: () => void;
}

export const DashboardHeader = ({ user, onProfileClick, onLogoutClick }: DashboardHeaderProps) => {
    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                            <img
                                src="/images/cloudseals-logo-white-bg.png"
                                alt="CloudSeals Logo"
                                className="h-6 w-auto brightness-0 invert"
                            />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            CloudSeals
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 mr-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user ? `@${user.username}` : ''}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={onProfileClick}
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </Button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                        <Button
                            onClick={onLogoutClick}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
