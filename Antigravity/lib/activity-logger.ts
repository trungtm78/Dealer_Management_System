import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function logActivity(
  request: NextRequest,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ',
  entity: string,
  entityId?: string,
  details?: any
) {
  try {
    // Extract user ID from request (you may need to adjust this based on your auth setup)
    const userId = request.headers.get('x-user-id') || '1' // Fallback to user ID 1 for development

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Create activity log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      user_id: userId,
      action,
      entity,
      entity_id: entityId || null,
      details: details || null,
      ip_address: ip,
      url: request.url,
      method: request.method
    }

    // Try to log to database first
    try {
      await prisma.activityLog.create({
        data: {
          user_id: userId,
          action,
          entity,
          entity_id: entityId,
          details: details ? JSON.stringify(details) : null,
          ip_address: ip
        }
      })
    } catch (dbError) {
      // If database logging fails, fall back to file logging
      console.warn('Database logging failed, falling back to file logging:', dbError)
      
      // Log to file
      const logDir = path.join(process.cwd(), 'logs')
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }
      
      const logFile = path.join(logDir, 'activity.log')
      const logLine = JSON.stringify(logEntry) + '\n'
      
      fs.appendFileSync(logFile, logLine)
    }
  } catch (error) {
    // Don't throw error - activity logging should not break the main functionality
    console.error('Failed to log activity:', error)
  }
}

export function withActivityLogging(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  entity: string,
  getIdFromBody?: (body: any) => string
) {
  return async (request: NextRequest, context?: any) => {
    const method = request.method
    const url = new URL(request.url)
    
    // Clone the request so we can read the body
    const requestClone = request.clone() as NextRequest
    
    try {
      // For POST, PUT, PATCH, DELETE methods, log the activity
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        let action: 'CREATE' | 'UPDATE' | 'DELETE'
        let entityId: string | undefined
        let details: any

        // Determine action type
        if (method === 'POST') {
          action = 'CREATE'
        } else if (method === 'DELETE') {
          action = 'DELETE'
        } else {
          action = 'UPDATE'
        }

        // Get entity ID from URL for UPDATE/DELETE operations
        if (action !== 'CREATE') {
          const pathParts = url.pathname.split('/')
          entityId = pathParts[pathParts.length - 1]
        }

        // Get request details
        if (method !== 'GET') {
          const body = await requestClone.json()
          details = {
            method,
            url: url.pathname,
            body: redactSensitiveData(body)
          }

          // For CREATE operations, get ID from response or body
          if (action === 'CREATE' && getIdFromBody) {
            entityId = getIdFromBody(body)
          }
        }

        // Log the activity
        await logActivity(
          requestClone,
          action,
          entity,
          entityId,
          details
        )
      }
    } catch (error) {
      // Don't break the main request if logging fails
      console.error('Activity logging error:', error)
    }

    // Call the original handler
    return handler(request, context)
  }
}

function redactSensitiveData(data: any): any {
  const sensitiveFields = ['password', 'password_hash', 'credit_card', 'ssn', 'secret']
  
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const redacted: any = {}
  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.includes(key.toLowerCase())) {
      redacted[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value)
    } else {
      redacted[key] = value
    }
  }

  return redacted
}

// Higher-order function for specific entity types
export function createEntityHandler(entity: string) {
  return function(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
    return withActivityLogging(handler, entity)
  }
}

// Predefined handlers for common entities
export const withCustomerLogging = createEntityHandler('Customer')
export const withUserLogging = createEntityHandler('User')
export const withLeadLogging = createEntityHandler('Lead')
export const withQuotationLogging = createEntityHandler('Quotation')
export const withInvoiceLogging = createEntityHandler('Invoice')
export const withPaymentLogging = createEntityHandler('Payment')
export const withPartLogging = createEntityHandler('Part')
export const withSupplierLogging = createEntityHandler('Supplier')
export const withVehicleLogging = createEntityHandler('Vehicle')
export const withVehicleModelLogging = createEntityHandler('VehicleModel')
