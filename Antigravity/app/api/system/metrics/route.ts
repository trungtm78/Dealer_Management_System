import { NextRequest, NextResponse } from 'next/server'
import { 
  systemMetricsCollector, 
  getCurrentSystemMetrics, 
  getMetricsHistory 
} from '@/lib/system-metrics'

// GET /api/system/metrics/current - Get current system metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'current' or 'history'
    const metricType = searchParams.get('metric_type')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (type === 'history' && metricType) {
      // Get historical metrics for a specific metric type
      const history = await getMetricsHistory(metricType, limit)
      return NextResponse.json({
        success: true,
        data: history,
        metric_type: metricType,
        count: history.length
      })
    } else {
      // Get current system metrics
      const currentMetrics = await getCurrentSystemMetrics()
      return NextResponse.json({
        success: true,
        data: currentMetrics,
        collector_running: systemMetricsCollector.isCollectorRunning()
      })
    }
  } catch (error) {
    console.error('API Error [GET /api/system/metrics]:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'SYS_500',
        message: 'Failed to fetch system metrics'
      }
    }, { status: 500 })
  }
}

// POST /api/system/metrics/start - Start metrics collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, interval } = body

    if (action === 'start') {
      await systemMetricsCollector.start()
      return NextResponse.json({
        success: true,
        message: 'System metrics collection started',
        interval: systemMetricsCollector['options'].interval
      })
    } else if (action === 'stop') {
      systemMetricsCollector.stop()
      return NextResponse.json({
        success: true,
        message: 'System metrics collection stopped'
      })
    } else if (action === 'restart') {
      systemMetricsCollector.stop()
      await systemMetricsCollector.start()
      return NextResponse.json({
        success: true,
        message: 'System metrics collection restarted',
        interval: systemMetricsCollector['options'].interval
      })
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: 'SYS_400',
          message: 'Invalid action. Use: start, stop, or restart'
        }
      }, { status: 400 })
    }
  } catch (error) {
    console.error('API Error [POST /api/system/metrics]:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'SYS_500',
        message: 'Failed to control system metrics collection'
      }
    }, { status: 500 })
  }
}
