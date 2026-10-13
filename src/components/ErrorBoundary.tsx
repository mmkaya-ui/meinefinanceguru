"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { t } from '../utils/i18n';

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
  lang?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const lang = this.props.lang || "en";
      return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center text-rose-400 bg-rose-500/10 border border-rose-500/20">
          <AlertTriangle className="w-10 h-10 mb-3" />
          <h3 className="text-lg font-bold">{t("This section encountered an error", lang)}</h3>
          <p className="text-sm text-slate-300 mt-2 max-w-md">
            {this.props.fallbackMessage || t("Your data is safe, but this component could not be rendered.", lang)}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
