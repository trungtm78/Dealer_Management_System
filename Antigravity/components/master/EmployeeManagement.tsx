"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Filter, Phone, Mail, MapPin } from "lucide-react"
import { toast } from "sonner"

interface Employee {
  id: string
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  department_id: string
  department_name?: string
  position_id: string
  position_name?: string
  level_id: string
  level_name?: string
  status: string
  join_date: string
  created_at: string
  updated_at: string
}

interface EmployeeFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  department_id: string
  position_id: string
  level_id: string
  status: string
  join_date: string
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department_id: "",
    position_id: "",
    level_id: "",
    status: "ACTIVE",
    join_date: ""
  })
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null)
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null)
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null)

  // Mock data for departments, positions, levels
  const departments = [
    { id: "1", name: "Sales" },
    { id: "2", name: "Service" },
    { id: "3", name: "Parts" },
    { id: "4", name: "Admin" },
    { id: "5", name: "Finance" },
    { id: "6", name: "Management" }
  ]

  const positions = [
    { id: "1", name: "Staff" },
    { id: "2", name: "Senior Staff" },
    { id: "3", name: "Supervisor" },
    { id: "4", name: "Manager" },
    { id: "5", name: "Director" },
    { id: "6", name: "Executive" }
  ]

  const levels = [
    { id: "1", name: "Level 1" },
    { id: "2", name: "Level 2" },
    { id: "3", name: "Level 3" },
    { id: "4", name: "Level 4" },
    { id: "5", name: "Level 5" },
    { id: "6", name: "Level 6" }
  ]

  const statuses = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "ON_LEAVE", label: "On Leave" },
    { value: "TERMINATED", label: "Terminated" }
  ]

  const departmentDataSource: SelectDataSource = {
    search: async (req) => {
      const res = await fetch('/api/shared/search/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      return res.json();
    }
  };

  const positionDataSource: SelectDataSource = {
    search: async (req) => {
      const res = await fetch('/api/shared/search/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      return res.json();
    }
  };

  const levelDataSource: SelectDataSource = {
    search: async (req) => {
      const res = await fetch('/api/shared/search/employee-levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      return res.json();
    }
  };

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("name", searchTerm)
      if (selectedDepartment) params.append("department_id", selectedDepartment)
      if (selectedPosition) params.append("position_id", selectedPosition)
      if (selectedLevel) params.append("level_id", selectedLevel)
      if (selectedStatus) params.append("status", selectedStatus)

      const response = await fetch(`/api/master/employees?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEmployees(data.data || [])
      } else {
        toast.error("Failed to fetch employees")
      }
    } catch (error) {
      toast.error("Error fetching employees")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdate = async () => {
    try {
      const url = editingEmployee ? `/api/master/employees/${editingEmployee.id}` : "/api/master/employees"
      const method = editingEmployee ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(editingEmployee ? "Employee updated successfully" : "Employee created successfully")
        fetchEmployees()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Error saving employee")
    }
  }

  const handleDelete = async (employee: Employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/master/employees/${employee.id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Employee deleted successfully")
        fetchEmployees()
      } else {
        toast.error("Failed to delete employee")
      }
    } catch (error) {
      toast.error("Error deleting employee")
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      department_id: employee.department_id,
      position_id: employee.position_id,
      level_id: employee.level_id,
      status: employee.status,
      join_date: employee.join_date.split('T')[0]
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingEmployee(null)
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      department_id: "",
      position_id: "",
      level_id: "",
      status: "ACTIVE",
      join_date: ""
    })
  }

  const filteredEmployees = employees.filter(employee => {
    const searchMatch = searchTerm === "" ||
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())

    const departmentMatch = selectedDepartment === "" || employee.department_id === selectedDepartment
    const positionMatch = selectedPosition === "" || employee.position_id === selectedPosition
    const levelMatch = selectedLevel === "" || employee.level_id === selectedLevel
    const statusMatch = selectedStatus === "" || employee.status === selectedStatus

    return searchMatch && departmentMatch && positionMatch && levelMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800"
      case "INACTIVE": return "bg-gray-100 text-gray-800"
      case "ON_LEAVE": return "bg-yellow-100 text-yellow-800"
      case "TERMINATED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <SmartSelect
                  dataSource={departmentDataSource}
                  value={selectedDepartmentId}
                  onChange={(id, item) => {
                    setSelectedDepartmentId(id as number | null);
                    setFormData({ ...formData, department_id: id ? String(id) : "" });
                  }}
                  label="Phòng ban"
                  placeholder="Chọn phòng ban..."
                  required={false}
                  context={{ onlyActive: true }}
                  className="w-full"
                />
              </div>
              <div>
                <SmartSelect
                  dataSource={positionDataSource}
                  value={selectedPositionId}
                  onChange={(id, item) => {
                    setSelectedPositionId(id as number | null);
                    setFormData({ ...formData, position_id: id ? String(id) : "" });
                  }}
                  label="Vị trí"
                  placeholder="Chọn vị trí..."
                  required={false}
                  context={{ onlyActive: true }}
                  className="w-full"
                />
              </div>
              <div>
                <SmartSelect
                  dataSource={levelDataSource}
                  value={selectedLevelId}
                  onChange={(id, item) => {
                    setSelectedLevelId(id as number | null);
                    setFormData({ ...formData, level_id: id ? String(id) : "" });
                  }}
                  label="Cấp bậc"
                  placeholder="Chọn cấp bậc..."
                  required={false}
                  context={{ onlyActive: true }}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="join_date">Join Date</Label>
                <Input
                  id="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrUpdate}>
                {editingEmployee ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment || "all"} onValueChange={(val) => setSelectedDepartment(val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPosition || "all"} onValueChange={(val) => setSelectedPosition(val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id}>{pos.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel || "all"} onValueChange={(val) => setSelectedLevel(val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus || "all"} onValueChange={(val) => setSelectedStatus(val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading employees...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employee_code}</TableCell>
                    <TableCell>{employee.first_name} {employee.last_name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department_name || employee.department_id}</TableCell>
                    <TableCell>{employee.position_name || employee.position_id}</TableCell>
                    <TableCell>{employee.level_name || employee.level_id}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(employee)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}