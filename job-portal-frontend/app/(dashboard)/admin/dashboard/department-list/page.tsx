"use client"
import { useEffect, useState } from "react"
import type React from "react"

import axios from "axios"
import toast from "react-hot-toast"
import { API_URL } from "@/lib/config"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Edit3, Trash2, Plus, Users } from "lucide-react"

type Department = {
    id: number
    name: string
}

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState<Department[]>([])
    const [name, setName] = useState("")
    const [editingId, setEditingId] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const authToken = Cookies.get("AuthToken")

    // Fetch departments from API
    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${API_URL}/departments`)
            setDepartments(res.data.departments)
        } catch (error) {
            toast.error("Failed to load departments")
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDepartments()
    }, [])

    // Add or update department
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error("Please enter name")
            return
        }
        setLoading(true)
        try {
            if (editingId) {
                // Update existing
                await axios.put(
                    `${API_URL}/admin/departments/${editingId}`,
                    { name },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            "Content-Type": "application/json",
                        },
                    },
                )
                toast.success("Department updated")
            } else {
                // Add new
                await axios.post(
                    `${API_URL}/admin/departments/add`,
                    { name },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            "Content-Type": "application/json",
                        },
                    },
                )
                toast.success("Department added")
            }
            setName("")
            setEditingId(null)
            fetchDepartments()
        } catch (error) {
            toast.error("Failed to save department")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Delete department
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this department?")) return

        setLoading(true)
        try {
            await axios.delete(`${API_URL}/admin/departments/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            })
            toast.success("Department deleted")
            fetchDepartments()
        } catch (error) {
            toast.error("Failed to delete department")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Start editing a department
    const handleEdit = (dept: Department) => {
        setName(dept.name)
        setEditingId(dept.id)
    }

    // Cancel editing
    const handleCancelEdit = () => {
        setName("")
        setEditingId(null)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <Building2 className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-xl font-semibold text-foreground">Department Management</h1>
                                <p className="text-sm text-muted-foreground">Manage your organization&apos;s departments</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{departments.length} Departments</span>
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    {editingId ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                    <span>{editingId ? "Edit Department" : "Add Department"}</span>
                                </CardTitle>
                                <CardDescription>
                                    {editingId ? "Update the department information" : "Create a new department for your organization"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Department Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={loading}
                                            placeholder="Enter department name"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex space-x-2 pt-2">
                                        <Button type="submit" disabled={loading} className="flex-1">
                                            {loading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                                    <span>Saving...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                                    <span>{editingId ? "Update" : "Add"}</span>
                                                </div>
                                            )}
                                        </Button>
                                        {editingId && (
                                            <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={loading}>
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Departments List Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Departments</CardTitle>
                                <CardDescription>All departments in your organization</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {departments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-foreground mb-2">No departments found</h3>
                                        <p className="text-muted-foreground mb-4">Get started by creating your first department.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {departments.map((dept, index) => (
                                            <div key={dept.id}>
                                                <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Building2 className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-foreground">{dept.name}</h3>
                                                            <p className="text-sm text-muted-foreground">Department ID: {dept.id}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(dept)}
                                                            disabled={loading}
                                                            className="text-primary hover:text-primary hover:bg-primary/10"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(dept.id)}
                                                            disabled={loading}
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {index < departments.length - 1 && <Separator className="my-2" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
