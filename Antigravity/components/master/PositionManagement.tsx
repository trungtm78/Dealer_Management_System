"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Position {
  id: string
  position_code: string
  position_name: string
  description: string
  status: string
  created_at: string
  updated_at: string
  _count?: {
    employees: number
  }
}

interface PositionFormData {
  position_code: string
  position_name: string
  description: string
  status: string
}

export function PositionManagement() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [formData, setFormData] = useState<PositionFormData>({
    position_code: "",
    position_name: "",
    description: "",
    status: "ACTIVE"
  })

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const res = await fetch("/api/master/positions")
      const data = await res.json()
      setPositions(data.data || [])
    } catch (error) {
      toast.error("Failed to fetch positions")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPosition(null)
    setFormData({
      position_code: "",
      position_name: "",
      description: "",
      status: "ACTIVE"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (position: Position) => {
    setEditingPosition(position)
    setFormData({
      position_code: position.position_code,
      position_name: position.position_name,
      description: position.description || "",
      status: position.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return

    try {
      const res = await fetch(`/api/master/positions/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        toast.success("Position deleted successfully")
        fetchPositions()
      } else {
        toast.error("Failed to delete position")
      }
    } catch (error) {
      toast.error("Failed to delete position")
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingPosition
        ? `/api/master/positions/${editingPosition.id}`
        : "/api/master/positions"

      const method = editingPosition ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingPosition ? "Position updated" : "Position created")
        setIsDialogOpen(false)
        fetchPositions()
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to save position")
      }
    } catch (error) {
      toast.error("Failed to save position")
    }
  }

  const filteredPositions = positions.filter((pos) => {
    const matchesSearch =
      !searchTerm ||
      pos.position_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.position_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "ALL" || pos.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Position Management</h1>
          <p className="text-muted-foreground">Manage organization positions</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Position
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No positions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPositions.map((pos) => (
                    <TableRow key={pos.id}>
                      <TableCell>{pos.position_code}</TableCell>
                      <TableCell className="font-medium">{pos.position_name}</TableCell>
                      <TableCell>{pos.description || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={pos.status === "ACTIVE" ? "default" : "secondary"}
                        >
                          {pos.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{pos._count?.employees || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pos)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pos.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPosition ? "Edit" : "Create"} Position
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="position_code">Position Code</Label>
              <Input
                id="position_code"
                value={formData.position_code}
                onChange={(e) =>
                  setFormData({ ...formData, position_code: e.target.value })
                }
                disabled={!!editingPosition}
                placeholder="POS-XXX"
              />
            </div>

            <div>
              <Label htmlFor="position_name">Position Name *</Label>
              <Input
                id="position_name"
                value={formData.position_name}
                onChange={(e) =>
                  setFormData({ ...formData, position_name: e.target.value })
                }
                required
                placeholder="Sales Manager"
                maxLength={200}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Position description..."
              />
            </div>

            <div>
              <Label>Status</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ACTIVE" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INACTIVE" id="inactive" />
                  <Label htmlFor="inactive">Inactive</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingPosition ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
