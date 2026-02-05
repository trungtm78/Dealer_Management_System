"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource, SelectItem } from "@/types/smart-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Filter, Phone, Mail, MapPin, User, UserPlus } from "lucide-react"
import { toast } from "sonner"

interface Employee {
  id: string
  employee_code: string
  full_name: string
  email: string | null
  phone: string | null
  department_id: string | null
  department_name?: string
  position_id: string | null
  position_name?: string
  level_id: string | null
  level_name?: string
  status: string
  join_date: string | null
  created_at: string
  updated_at: string
  user_id?: string | null
  user_email?: string | null
}

interface EmployeeFormData {
  full_name: string
  email: string
  phone: string
  department_id: string
  position_id: string
  level_id: string
  status: string
  join_date: string
  user_id: string | null
}

interface UserFormData {
  email: string
  password: string
  role_id: string
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ON_LEAVE", label: "On Leave" },
  { value: "TERMINATED", label: "Terminated" }
]

const POSITION_ROLE_MAPPING: Record<string, string[]> = {
  "Sales Manager": ["SALES_MANAGER", "SALES_STAFF"],
  "Service Advisor": ["SERVICE_ADVISOR", "SERVICE_STAFF"],
  "Technician": ["TECHNICIAN"],
  "Admin Staff": ["ADMIN"],
  "Warehouse Manager": ["WAREHOUSE_MANAGER", "WAREHOUSE_STAFF"],
  "Accountant": ["ACCOUNTANT"],
  "HR Manager": ["HR_MANAGER", "ADMIN"]
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
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState<EmployeeFormData>({
    full_name: "",
    email: "",
    phone: "",
    department_id: "",
    position_id: "",
    level_id: "",
    status: "ACTIVE",
    join_date: "",
    user_id: null
  })
  const [userFormData, setUserFormData] = useState<UserFormData>({
    email: "",
    password: "",
    role_id: ""
  })

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

  const userDataSource: SelectDataSource = {
    search: async (req) => {
      const res = await fetch('/api/shared/search/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
          context: {
            onlyActive: true,
            excludeLinkedUsers: true
          }
        })
      });
      return res.json();
    }
  };

  const roleDataSource: SelectDataSource = {
    search: async (req) => {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
          for_dropdown: true
        })
      });
      const data = await res.json();
      return {
        items: data.data.map((role: any) => ({
          id: role.id,
          label: role.name,
          subtitle: role.description || "",
          meta: role
        })),
        nextCursor: null
      };
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
    if (!formData.full_name || formData.full_name.trim().length === 0) {
      toast.error("Full name is required")
      return
    }
    if (formData.full_name.length > 200) {
      toast.error("Full name must be less than 200 characters")
      return
    }
    if (formData.email && formData.email.length > 200) {
      toast.error("Email must be less than 200 characters")
      return
    }

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
    if (!confirm(`Are you sure you want to delete ${employee.full_name}?`)) {
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
      full_name: employee.full_name,
      email: employee.email || "",
      phone: employee.phone || "",
      department_id: employee.department_id || "",
      position_id: employee.position_id || "",
      level_id: employee.level_id || "",
      status: employee.status,
      join_date: employee.join_date ? employee.join_date.split('T')[0] : "",
      user_id: employee.user_id || null
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingEmployee(null)
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      department_id: "",
      position_id: "",
      level_id: "",
      status: "ACTIVE",
      join_date: "",
      user_id: null
    })
  }

  const handleCreateUser = async () => {
    try {
      if (!userFormData.email || !userFormData.password || !userFormData.role_id) {
        toast.error("Email, password and role are required")
        return
      }

      const response = await fetch(`/api/master/employees/${editingEmployee!.id}/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userFormData)
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("User account created and linked successfully")
        setFormData({ ...formData, user_id: data.user.id })
        setIsCreateUserDialogOpen(false)
        fetchEmployees()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to create user")
      }
    } catch (error) {
      toast.error("Error creating user")
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const searchMatch = searchTerm === "" ||
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()))

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

  const suggestedRoles = editingEmployee?.position_name
    ? POSITION_ROLE_MAPPING[editingEmployee.position_name] || []
    : []

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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    required
                    maxLength={200}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="employee@honda.com"
                    maxLength={200}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <SmartSelect
                    dataSource={departmentDataSource}
                    value={formData.department_id}
                    onChange={(id) => setFormData({ ...formData, department_id: id as string })}
                    label="Phòng ban"
                    placeholder="Chọn phòng ban..."
                    allowClear={true}
                    context={{ onlyActive: true }}
                    className="w-full"
                  />
                </div>

                <div>
                  <SmartSelect
                    dataSource={positionDataSource}
                    value={formData.position_id}
                    onChange={(id) => setFormData({ ...formData, position_id: id as string })}
                    label="Vị trí"
                    placeholder="Chọn vị trí..."
                    allowClear={true}
                    context={{ onlyActive: true }}
                    className="w-full"
                  />
                </div>

                <div>
                  <SmartSelect
                    dataSource={levelDataSource}
                    value={formData.level_id}
                    onChange={(id) => setFormData({ ...formData, level_id: id as string })}
                    label="Cấp bậc"
                    placeholder="Chọn cấp bậc..."
                    allowClear={true}
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
                      {STATUS_OPTIONS.map((status) => (
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

              <div className="col-span-2 border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4">User Account</h3>

                <div>
                  <SmartSelect
                    dataSource={userDataSource}
                    value={formData.user_id}
                    onChange={(id) => setFormData({ ...formData, user_id: id as string })}
                    label="Link to User Account (Optional)"
                    placeholder="Select user account..."
                    allowClear={true}
                    context={{ onlyActive: true, excludeLinkedUsers: true }}
                  />
                </div>

                <div className="mt-2">
                  <Button
                    onClick={() => setIsCreateUserDialogOpen(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User Account
                  </Button>
                </div>

                {formData.user_id && editingEmployee?.user_email && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-sm">
                      <User className="w-3 h-3 inline mr-1" />
                      Linked to: <strong>{editingEmployee.user_email}</strong>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateOrUpdate}>
                  {editingEmployee ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create User Account for {editingEmployee?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user_email">Email *</Label>
              <Input
                id="user_email"
                type="email"
                value={userFormData.email || editingEmployee?.email || ""}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                required
                minLength={8}
                placeholder="Min 8 chars, uppercase, lowercase, number"
              />
            </div>

            {suggestedRoles.length > 0 && (
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm font-medium mb-2">
                  Suggested roles for "{editingEmployee?.position_name}":
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedRoles.map((role) => (
                    <Badge key={role} className="bg-blue-100 text-blue-800">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Role *</Label>
              <SmartSelect
                dataSource={roleDataSource}
                value={userFormData.role_id}
                onChange={(id) => setUserFormData({ ...userFormData, role_id: id as string })}
                placeholder="Select role..."
                required
                context={{ suggestedFirst: true }}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateUserDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                Create User Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            <SmartSelect
              dataSource={departmentDataSource}
              value={selectedDepartment}
              onChange={(id) => setSelectedDepartment(id as string)}
              label="Department"
              placeholder="All Departments"
              allowClear={true}
              context={{ onlyActive: true }}
              className="w-full"
            />
            <SmartSelect
              dataSource={positionDataSource}
              value={selectedPosition}
              onChange={(id) => setSelectedPosition(id as string)}
              label="Position"
              placeholder="All Positions"
              allowClear={true}
              context={{ onlyActive: true }}
              className="w-full"
            />
            <SmartSelect
              dataSource={levelDataSource}
              value={selectedLevel}
              onChange={(id) => setSelectedLevel(id as string)}
              label="Level"
              placeholder="All Levels"
              allowClear={true}
              context={{ onlyActive: true }}
              className="w-full"
            />
            <Select value={selectedStatus || "all"} onValueChange={(val) => setSelectedStatus(val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((status) => (
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
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.employee_code}</TableCell>
                      <TableCell>{employee.full_name}</TableCell>
                      <TableCell>{employee.email || "-"}</TableCell>
                      <TableCell>{employee.department_name || employee.department_id || "-"}</TableCell>
                      <TableCell>{employee.position_name || employee.position_id || "-"}</TableCell>
                      <TableCell>{employee.level_name || employee.level_id || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {employee.user_id ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            <User className="w-3 h-3 mr-1" />
                            {employee.user_email || "Linked"}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">No user</span>
                        )}
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
