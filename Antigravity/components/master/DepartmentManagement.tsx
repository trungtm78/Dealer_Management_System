"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SmartSelect } from "@/components/SmartSelect"
import type { SelectDataSource, SelectItem } from "@/types/smart-select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Department {
  id: string
  department_code: string
  department_name: string
  description: string
  status: string
  created_at: string
  updated_at: string
  _count?: {
    employees: number
  }
}

interface DepartmentFormData {
  department_code: string
  department_name: string
  description: string
  status: string
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState<DepartmentFormData>({
    department_code: "",
    department_name: "",
    description: "",
    status: "ACTIVE"
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/master/departments")
      const data = await res.json()
      setDepartments(data.data || [])
    } catch (error) {
      toast.error("Failed to fetch departments")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingDepartment(null)
    setFormData({
      department_code: "",
      department_name: "",
      description: "",
      status: "ACTIVE"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      department_code: department.department_code,
      department_name: department.department_name,
      description: department.description || "",
      status: department.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return

    try {
      const res = await fetch(`/api/master/departments/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        toast.success("Department deleted successfully")
        fetchDepartments()
      } else {
        toast.error("Failed to delete department")
      }
    } catch (error) {
      toast.error("Failed to delete department")
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingDepartment
        ? `/api/master/departments/${editingDepartment.id}`
        : "/api/master/departments"

      const method = editingDepartment ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingDepartment ? "Department updated" : "Department created")
        setIsDialogOpen(false)
        fetchDepartments()
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to save department")
      }
    } catch (error) {
      toast.error("Failed to save department")
    }
  }

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      !searchTerm ||
      dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.department_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "ALL" || dept.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Department Management</h1>
          <p className="text-muted-foreground">Manage organization departments</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Department
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
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
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No departments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>{dept.department_code}</TableCell>
                      <TableCell className="font-medium">{dept.department_name}</TableCell>
                      <TableCell>{dept.description || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={dept.status === "ACTIVE" ? "default" : "secondary"}
                        >
                          {dept.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{dept._count?.employees || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(dept)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(dept.id)}
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
              {editingDepartment ? "Edit" : "Create"} Department
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="department_code">Department Code</Label>
              <Input
                id="department_code"
                value={formData.department_code}
                onChange={(e) =>
                  setFormData({ ...formData, department_code: e.target.value })
                }
                disabled={!!editingDepartment}
                placeholder="DEPT-XXX"
              />
            </div>

            <div>
              <Label htmlFor="department_name">Department Name *</Label>
              <Input
                id="department_name"
                value={formData.department_name}
                onChange={(e) =>
                  setFormData({ ...formData, department_name: e.target.value })
                }
                required
                placeholder="Sales Department"
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
                placeholder="Department description..."
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
                {editingDepartment ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
