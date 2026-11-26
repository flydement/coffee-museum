import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  onResetHome: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || '展厅模块加载中断',
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[CoffeeMuseum ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="archive-empty" role="alert" style={{ maxWidth: 560, margin: '36px auto' }}>
          <p className="eyebrow">EXHIBITION RECOVERY · 展厅恢复</p>
          <h2 className="section-heading" style={{ fontSize: '1.4rem', marginBottom: 10 }}>
            展厅资源刚刚更新或加载中断
          </h2>
          <p className="section-lead" style={{ margin: '0 auto 20px' }}>
            如果展馆刚刚发布了新版本，刷新一次页面即可获取最新资源。
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              刷新加载最新展馆
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                this.setState({ hasError: false, message: '' })
                this.props.onResetHome()
              }}
            >
              返回风味策展台
            </button>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
