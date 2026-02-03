"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, DollarSign, Percent } from "lucide-react"
import { formatCurrency } from "@/lib/utils/format"
import { DashboardKPIs } from "@/actions/insurance/dashboard"

interface KPICardsProps {
  kpis: DashboardKPIs
}

export default function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Active Policies */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
          <Shield className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.active_policies}</div>
          <p className="text-xs text-white/80">Active insurance policies</p>
        </CardContent>
      </Card>

      {/* Claims In Progress */}
      <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Claims In Progress</CardTitle>
          <FileText className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.claims_in_progress}</div>
          <p className="text-xs text-white/80">Pending claims</p>
        </CardContent>
      </Card>

      {/* Premium YTD */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Premium YTD</CardTitle>
          <DollarSign className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.premium_ytd)}</div>
          <p className="text-xs text-white/80">Year to date premium</p>
        </CardContent>
      </Card>

      {/* Commission YTD */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commission YTD</CardTitle>
          <Percent className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.commission_ytd)}</div>
          <p className="text-xs text-white/80">Year to date commission</p>
        </CardContent>
      </Card>
    </div>
  )
}