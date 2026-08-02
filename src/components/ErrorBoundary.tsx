import React, { Component } from 'react';
import { Info } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props!: ErrorBoundaryProps;
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 max-w-sm shadow-xl space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto">
              <Info size={32} />
            </div>
            <h2 className="text-xl font-bold text-red-800">कुछ गलत हो गया / Something went wrong</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              ऐप में एक समस्या आई है। कृपया ऐप रीस्टार्ट करें या नीचे दिए गए बटन पर क्लिक करें।
              <br />
              An error occurred in the application. Please restart the app or click the button below.
            </p>
            <div className="bg-gray-100 p-3 rounded-xl max-h-32 overflow-y-auto text-left">
              <p className="text-[10px] font-mono text-red-600 leading-normal break-all">
                {this.state.error?.toString()}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-[#2D5A27] text-white py-3 rounded-xl font-bold hover:bg-[#1E3E1A] transition-colors shadow-md active:scale-95"
            >
              रीफ्रेश करें / Refresh App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
