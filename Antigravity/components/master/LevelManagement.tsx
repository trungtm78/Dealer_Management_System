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

interface Level {
  id: string
  level_code: string
  level_name: string
  description: string
  status: string
  created_at: string
  updated_at: string
  _count?: {
    employees: number
  }
}

interface LevelFormData {
  level_code: string
  level_name: string
  description: string
  status: string
}

export function LevelManagement() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<Level | null>(null)
  const [formData, setFormData] = useState<LevelFormData>({
    level_code: "",
    level_name: "",
    description: "",
    status: "ACTIVE"
  })

  useEffect(() => {
    fetchLevels()
  }, [])

  const fetchLevels = async () => {
    try {
      const res = await fetch("/api/master/levels")
      const data = await res.json()
      setLevels(data.data || [])
    } catch (error) {
      toast.error("Failed to fetch levels")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingLevel(null)
    setFormData({
      level_code: "",
      level_name: "",
      description: "",
      status: "ACTIVE"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (level: Level) => {
    setEditingLevel(level)
    setFormData({
      level_code: level.level_code,
      level_name: level.level_name,
      description: level.description || "",
      status: level.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this level?")) return

    try {
      const res = await fetch(`/api/master/levels/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        toast.success("Level deleted successfully")
        fetchLevels()
      } else {
        toast.error("Failed to delete level")
      }
    } catch (error) {
      toast.error("Failed to delete level")
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingLevel
        ? `/api/master/levels/${editingLevel.id}`
        : "/api/master/levels"

      const method = editingLevel ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingLevel ? "Level updated" : "Level created")
        setIsDialogOpen(false)
        fetchLevels()
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to save level")
      }
    } catch (error) {
      toast.error("Failed to save level")
    }
  }

  const filteredLevels = levels.filter((lvl) => {
    const matchesSearch =
      !searchTerm ||
      lvl.level_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lvl.level_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "ALL" || lvl.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Level Management</h1>
          <p className="text-muted-foreground">Manage employee levels</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Level
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search levels..."
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
                {filteredLevels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No levels found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLevels.map((lvl) => (
                    <TableRow key={lvl.id}>
                      <TableCell>{lvl.level_code}</TableCell>
                      <TableCell className="font-medium">{lvl.level_name}</TableCell>
                      <TableCell>{lvl.description || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={lvl.status === "ACTIVE" ? "default" : "secondary"}
                        >
                          {lvl.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lvl._count?.employees || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(lvl)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(lvl.id)}
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
              {editingLevel ? "Edit" : "Create"} Level
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="level_code">Level Code</Label>
              <Input
                id="level_code"
                value={formData.level_code}
                onChange={(e) =>
                  setFormData({ ...formData, level_code: e.target.value })
                }
                disabled={!!editingLevel}
                placeholder="LVL-XXX"
              />
            </div>

            <div>
              <Label htmlFor="level_name">Level Name *</Label>
              <Input
                id="level_name"
                value={formData.level_name}
                onChange={(e) =>
                  setFormData({ ...formData, level_name: e.target.value })
                }
                required
                placeholder="Level 1"
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
                placeholder="Level description..."
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
                {editingLevel ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
