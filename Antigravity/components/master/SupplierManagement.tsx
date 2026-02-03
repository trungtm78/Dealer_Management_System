"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Search, Filter, Phone, Mail, MapPin } from "lucide-react"
import { toast } from "sonner"

interface Supplier {
  id: string
  supplier_code: string
  name: string
  tax_code: string
  email: string
  phone: string
  address: string
  status: string
  contact_person: string
  created_at: string
  updated_at: string
}

interface SupplierFormData {
  name: string
  tax_code: string
  email: string
  phone: string
  address: string
  contact_person: string
  status: string
}

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    tax_code: "",
    email: "",
    phone: "",
    address: "",
    contact_person: "",
    status: "ACTIVE"
  })

  const statuses = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "BLACKLISTED", label: "Blacklisted" }
  ]

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("name", searchTerm)
      if (selectedStatus) params.append("status", selectedStatus)

      const response = await fetch(`/api/master/suppliers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data.data || [])
      } else {
        toast.error("Failed to fetch suppliers")
      }
    } catch (error) {
      toast.error("Error fetching suppliers")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdate = async () => {
    try {
      const url = editingSupplier ? `/api/master/suppliers/${editingSupplier.id}` : "/api/master/suppliers"
      const method = editingSupplier ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(editingSupplier ? "Supplier updated successfully" : "Supplier created successfully")
        fetchSuppliers()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Error saving supplier")
    }
  }

  const handleDelete = async (supplier: Supplier) => {
    if (!confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/master/suppliers/${supplier.id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Supplier deleted successfully")
        fetchSuppliers()
      } else {
        toast.error("Failed to delete supplier")
      }
    } catch (error) {
      toast.error("Error deleting supplier")
    }
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      tax_code: supplier.tax_code,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contact_person: supplier.contact_person,
      status: supplier.status
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingSupplier(null)
    setFormData({
      name: "",
      tax_code: "",
      email: "",
      phone: "",
      address: "",
      contact_person: "",
      status: "ACTIVE"
    })
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const searchMatch = searchTerm === "" ||
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplier_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.tax_code.toLowerCase().includes(searchTerm.toLowerCase())

    const statusMatch = selectedStatus === "" || supplier.status === selectedStatus

    return searchMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800"
      case "INACTIVE": return "bg-gray-100 text-gray-800"
      case "BLACKLISTED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Supplier Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Supplier Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <Label htmlFor="tax_code">Tax Code</Label>
                <Input
                  id="tax_code"
                  value={formData.tax_code}
                  onChange={(e) => setFormData({ ...formData, tax_code: e.target.value })}
                  placeholder="Enter tax code"
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="Contact person name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="supplier@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete address"
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
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrUpdate}>
                {editingSupplier ? "Update" : "Create"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
          <CardTitle>Supplier List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading suppliers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.supplier_code}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {supplier.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.contact_person}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(supplier.status)}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(supplier)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(supplier)}
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