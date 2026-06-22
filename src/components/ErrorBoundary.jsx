import { Component } from 'react';

/**
 * Catches render / lifecycle / effect errors in the subtree and renders a
 * fallback instead of letting React 18 tear down the whole root (which would
 * leave the user on a blank or frozen screen).
 *
 * Pass `fallback` to control what renders on error. Used around the WebGL
 * shader so a missing-WebGL device degrades to a flat background instead of
 * crashing the entire page.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface the underlying error so future issues stay diagnosable.
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
