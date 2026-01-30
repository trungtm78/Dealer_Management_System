import prisma from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export interface SystemMetrics {
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  uptime: number
  timestamp: Date
}

export interface MetricCollectionOptions {
  interval?: number // in milliseconds
  persistToDatabase?: boolean
  logToFile?: boolean
}

export class SystemMetricsCollector {
  private intervalId: NodeJS.Timeout | null = null
  private isRunning = false
  private options: Required<MetricCollectionOptions>

  constructor(options: MetricCollectionOptions = {}) {
    this.options = {
      interval: options.interval || 60000, // Default: 1 minute
      persistToDatabase: options.persistToDatabase !== false,
      logToFile: options.logToFile !== false
    }
  }

  async collectMetrics(): Promise<SystemMetrics> {
    try {
      // Get CPU usage (simplified for cross-platform compatibility)
      const cpuUsage = process.cpuUsage()
      const totalCpuUsage = (cpuUsage.user + cpuUsage.system) / 1000000 // Convert to seconds
      
      // Get memory usage
      const memoryUsage = process.memoryUsage()
      const totalMemory = memoryUsage.heapTotal
      const usedMemory = memoryUsage.heapUsed
      const memoryUsagePercent = (usedMemory / totalMemory) * 100

      // Get disk usage (simplified - in a real app you'd use proper system calls)
      let diskUsage = 0
      try {
        const stats = fs.statSync(process.cwd())
        // This is a simplified disk usage calculation
        // In production, you'd want to use proper system calls or a library
        diskUsage = Math.random() * 100 // Placeholder for demo
      } catch (error) {
        console.warn('Could not get disk usage:', error)
      }

      // Get process uptime
      const uptime = process.uptime()

      const metrics: SystemMetrics = {
        cpu_usage: Math.min(totalCpuUsage, 100), // Cap at 100%
        memory_usage: Math.min(memoryUsagePercent, 100),
        disk_usage: Math.min(diskUsage, 100),
        uptime,
        timestamp: new Date()
      }

      return metrics
    } catch (error) {
      console.error('Error collecting system metrics:', error)
      throw error
    }
  }

  async persistMetrics(metrics: SystemMetrics): Promise<void> {
    try {
      // Persist to database
      if (this.options.persistToDatabase) {
        await this.saveToDatabase(metrics)
      }

      // Log to file
      if (this.options.logToFile) {
        await this.logToFile(metrics)
      }
    } catch (error) {
      console.error('Error persisting metrics:', error)
      throw error
    }
  }

  private async saveToDatabase(metrics: SystemMetrics): Promise<void> {
    const metricsToSave = [
      {
        metric_type: 'CPU_USAGE',
        value: metrics.cpu_usage,
        unit: 'percent',
        timestamp: metrics.timestamp
      },
      {
        metric_type: 'MEMORY_USAGE',
        value: metrics.memory_usage,
        unit: 'percent',
        timestamp: metrics.timestamp
      },
      {
        metric_type: 'DISK_USAGE',
        value: metrics.disk_usage,
        unit: 'percent',
        timestamp: metrics.timestamp
      },
      {
        metric_type: 'UPTIME',
        value: metrics.uptime,
        unit: 'seconds',
        timestamp: metrics.timestamp
      }
    ]

    try {
      await prisma.systemMetric.createMany({
        data: metricsToSave
      })
    } catch (dbError) {
      console.warn('Database metrics save failed:', dbError)
      // Fallback to file logging if database fails
      await this.logToFile(metrics)
    }
  }

  private async logToFile(metrics: SystemMetrics): Promise<void> {
    try {
      const logDir = path.join(process.cwd(), 'logs')
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }

      const logFile = path.join(logDir, 'system-metrics.log')
      const logEntry = {
        timestamp: metrics.timestamp.toISOString(),
        cpu_usage: metrics.cpu_usage,
        memory_usage: metrics.memory_usage,
        disk_usage: metrics.disk_usage,
        uptime: metrics.uptime
      }

      const logLine = JSON.stringify(logEntry) + '\n'
      fs.appendFileSync(logFile, logLine)
    } catch (error) {
      console.error('Failed to log metrics to file:', error)
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('System metrics collector is already running')
      return
    }

    console.log(`Starting system metrics collection with ${this.options.interval}ms interval`)

    // Collect initial metrics
    try {
      const metrics = await this.collectMetrics()
      await this.persistMetrics(metrics)
      console.log('Initial system metrics collected:', metrics)
    } catch (error) {
      console.error('Error collecting initial metrics:', error)
    }

    // Start periodic collection
    this.intervalId = setInterval(async () => {
      try {
        const metrics = await this.collectMetrics()
        await this.persistMetrics(metrics)
        
        // Log metrics at info level for monitoring
        if (process.env.NODE_ENV === 'development') {
          console.log('System metrics:', {
            cpu: `${metrics.cpu_usage.toFixed(2)}%`,
            memory: `${metrics.memory_usage.toFixed(2)}%`,
            disk: `${metrics.disk_usage.toFixed(2)}%`,
            uptime: `${Math.floor(metrics.uptime / 3600)}h ${Math.floor((metrics.uptime % 3600) / 60)}m`
          })
        }
      } catch (error) {
        console.error('Error in metrics collection cycle:', error)
      }
    }, this.options.interval)

    this.isRunning = true
    console.log('System metrics collector started successfully')
  }

  stop(): void {
    if (!this.isRunning || !this.intervalId) {
      console.warn('System metrics collector is not running')
      return
    }

    clearInterval(this.intervalId)
    this.intervalId = null
    this.isRunning = false
    console.log('System metrics collector stopped')
  }

  isCollectorRunning(): boolean {
    return this.isRunning
  }
}

// Singleton instance
export const systemMetricsCollector = new SystemMetricsCollector()

// Helper functions for on-demand metrics collection
export async function getCurrentSystemMetrics(): Promise<SystemMetrics> {
  return await systemMetricsCollector.collectMetrics()
}

export async function getMetricsHistory(
  metricType: string,
  limit: number = 100
): Promise<any[]> {
  try {
    const metrics = await prisma.systemMetric.findMany({
      where: {
        metric_type: metricType
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    })

    return metrics
  } catch (error) {
    console.error(`Error fetching ${metricType} history:`, error)
    return []
  }
}

// Initialize metrics collection on module load (if in production)
if (process.env.NODE_ENV === 'production' && process.env.ENABLE_METRICS_COLLECTION === 'true') {
  systemMetricsCollector.start().catch(console.error)
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    systemMetricsCollector.stop()
  })
  
  process.on('SIGINT', () => {
    systemMetricsCollector.stop()
  })
}
