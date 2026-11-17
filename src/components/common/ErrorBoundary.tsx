import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Wrench } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FixNear ErrorBoundary Caught Error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F8F5] flex flex-col items-center justify-center p-4 text-[#172033]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-[#0B1F3A]">
                <Wrench size={13} className="text-[#3B82F6]" />
                <span>FixNear Application Safe Recovery</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0B1F3A]">
                Something went wrong
              </h1>
              <p className="text-xs text-[#667085] leading-relaxed">
                An unexpected interface issue occurred. Your data has been preserved in the database.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors border border-gray-200"
              >
                <RotateCcw size={14} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#152E52] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                <Home size={14} />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Collapsible Error Details for Troubleshooting */}
            {this.state.error && (
              <details className="text-left bg-gray-50 rounded-xl p-3 border border-gray-200 text-[11px] text-gray-600">
                <summary className="cursor-pointer font-semibold text-gray-700 select-none">
                  Technical Diagnostics
                </summary>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] text-rose-700 bg-white p-2 rounded border border-rose-100 overflow-x-auto max-h-36">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
