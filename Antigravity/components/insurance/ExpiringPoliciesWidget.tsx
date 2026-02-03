"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calendar } from "lucide-react"
import { ExpiringPolicy } from "@/actions/insurance/dashboard"
import { formatDate, formatCurrency } from "@/lib/utils/format"
import Link from "next/link"

interface ExpiringPoliciesWidgetProps {
  policies: ExpiringPolicy[]
}

export default function ExpiringPoliciesWidget({ policies }: ExpiringPoliciesWidgetProps) {
  const [filteredPolicies, setFilteredPolicies] = useState<ExpiringPolicy[]>(policies)

  useEffect(() => {
    setFilteredPolicies(policies)
  }, [policies])

  const getAlertColor = (daysLeft: number): string => {
    if (daysLeft <= 7) return "text-red-600 bg-red-50 border-red-200"
    if (daysLeft <= 14) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-yellow-600 bg-yellow-50 border-yellow-200"
  }

  const getAlertVariant = (daysLeft: number): "destructive" | "default" | "secondary" => {
    if (daysLeft <= 7) return "destructive"
    if (daysLeft <= 14) return "default"
    return "secondary"
  }

  if (policies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Expiring Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No policies expiring within 30 days</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Expiring Policies
          <Badge variant="destructive" className="ml-auto">
            {policies.length} policies expiring within 30 days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${getAlertColor(policy.days_left)}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{policy.customer_name}</h4>
                  <Badge variant={getAlertVariant(policy.days_left)}>
                    {policy.days_left} days
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">Policy:</span> {policy.contract_number}
                  </p>
                  {policy.vehicle_vin && (
                    <p>
                      <span className="font-medium">VIN:</span> {policy.vehicle_vin}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Expiry:</span> {formatDate(policy.expiry_date)}
                  </p>
                  <p>
                    <span className="font-medium">Premium:</span> {formatCurrency(policy.premium_amount)}
                  </p>
                </div>
              </div>
              <div className="ml-4">
                <Link href={`/insurance/contracts/renew/${policy.id}`}>
                  <Button size="sm" variant="outline">
                    Gia hạn
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}