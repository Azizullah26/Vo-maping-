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
