"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { SafeRender } from "./SafeRender"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-6 m-4 bg-red-50 border border-red-200 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
          <div className="mb-4 p-3 bg-red-100 rounded text-red-800 font-mono text-sm overflow-auto">
            <SafeRender value={this.state.error} />
          </div>
          {this.state.errorInfo && (
            <details className="mb-4">
              <summary className="cursor-pointer text-red-600 font-medium">Stack trace</summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto text-xs">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export function AdminFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Dashboard Error</h1>
        <p className="mb-4">
          There was an error loading the admin dashboard. This might be due to database connection issues.
        </p>
        <p className="mb-6">The application is running in demo mode with sample data.</p>
        <div className="flex gap-4">
          <a href="/al-ain" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Return to Al Ain Map
          </a>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}
