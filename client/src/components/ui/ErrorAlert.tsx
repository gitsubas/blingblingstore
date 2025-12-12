import { AlertCircle, X } from "lucide-react";
import { Button } from "./Button";

interface ErrorAlertProps {
    error: string | null;
    onRetry?: () => void;
    onDismiss?: () => void;
    className?: string;
}

export function ErrorAlert({ error, onRetry, onDismiss, className = "" }: ErrorAlertProps) {
    if (!error) return null;

    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            size="sm"
                            className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                        >
                            Try Again
                        </Button>
                    )}
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        aria-label="Dismiss error"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
