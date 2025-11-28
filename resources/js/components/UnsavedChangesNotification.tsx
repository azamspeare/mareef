import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface UnsavedChangesNotificationProps {
    show: boolean;
    onReset: () => void;
    onSave: () => void;
}

export default function UnsavedChangesNotification({ show, onReset, onSave }: UnsavedChangesNotificationProps) {
    if (!show) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl px-4 py-3 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">Unsaved changes</span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="text-white hover:bg-white/10 h-8 px-3"
                    >
                        Reset
                    </Button>
                    <Button
                        size="sm"
                        onClick={onSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
