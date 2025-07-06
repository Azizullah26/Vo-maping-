"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Database, Key, Save, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface ConfigSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  fields: ConfigField[]
}

interface ConfigField {
  key: string
  label: string
  type: "text" | "password" | "textarea" | "url"
  value: string
  placeholder?: string
  required?: boolean
}

export default function SetupPage() {
  const [saving, setSaving] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"success" | "error" | null>(null)

  const [config, setConfig] = useState<ConfigSection[]>([
    {
      id: "database",
      title: "Database Configuration",
      description: "Configure your database connection settings",
      icon: <Database className="w-5 h-5" />,
      fields: [
        {
          key: "DATABASE_URL",
          label: "Database URL",
          type: "password",
          value: process.env.NEXT_PUBLIC_DATABASE_URL || "",
          placeholder: "postgresql://user:password@host:port/database",
          required: true,
        },
        {
          key: "DB_HOST",
          label: "Database Host",
          type: "text",
          value: "",
          placeholder: "localhost",
        },
        {
          key: "DB_PORT",
          label: "Database Port",
          type: "text",
          value: "5432",
          placeholder: "5432",
        },
        {
          key: "DB_NAME",
          label: "Database Name",
          type: "text",
          value: "",
          placeholder: "alain_db",
        },
      ],
    },
    {
      id: "api",
      title: "API Configuration",
      description: "Configure external API keys and endpoints",
      icon: <Key className="w-5 h-5" />,
      fields: [
        {
          key: "MAPBOX_ACCESS_TOKEN",
          label: "Mapbox Access Token",
          type: "password",
          value: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
          placeholder: "pk.ey...",
          required: true,
        },
        {
          key: "SUPABASE_URL",
          label: "Supabase URL",
          type: "url",
          value: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          placeholder: "https://your-project.supabase.co",
        },
        {
          key: "SUPABASE_ANON_KEY",
          label: "Supabase Anonymous Key",
          type: "password",
          value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          placeholder: "eyJ...",
        },
      ],
    },
    {
      id: "system",
      title: "System Settings",
      description: "General system configuration",
      icon: <Settings className="w-5 h-5" />,
      fields: [
        {
          key: "APP_NAME",
          label: "Application Name",
          type: "text",
          value: "Al Ain Interactive Map",
          placeholder: "Al Ain Interactive Map",
        },
        {
          key: "APP_DESCRIPTION",
          label: "Application Description",
          type: "textarea",
          value: "Interactive mapping system for Al Ain city projects and locations",
          placeholder: "Describe your application...",
        },
        {
          key: "BASE_URL",
          label: "Base URL",
          type: "url",
          value: process.env.NEXT_PUBLIC_BASE_URL || "",
          placeholder: "https://your-domain.com",
        },
      ],
    },
  ])

  const updateField = (sectionId: string, fieldKey: string, value: string) => {
    setConfig((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) => (field.key === fieldKey ? { ...field, value } : field)),
            }
          : section,
      ),
    )
  }

  const testDatabaseConnection = async () => {
    setTestingConnection(true)
    setConnectionStatus(null)

    try {
      const response = await fetch("/api/database-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          databaseUrl: config.find((s) => s.id === "database")?.fields.find((f) => f.key === "DATABASE_URL")?.value,
        }),
      })

      if (response.ok) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
      }
    } catch (error) {
      setConnectionStatus("error")
    } finally {
      setTestingConnection(false)
    }
  }

  const saveConfiguration = async () => {
    setSaving(true)

    try {
      // Prepare configuration data
      const configData = {}
      config.forEach((section) => {
        section.fields.forEach((field) => {
          configData[field.key] = field.value
        })
      })

      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      if (response.ok) {
        // Show success message
        alert("Configuration saved successfully!")
      } else {
        throw new Error("Failed to save configuration")
      }
    } catch (error) {
      alert("Error saving configuration: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Setup</h1>
          <p className="text-gray-600">Configure your Al Ain system settings</p>
        </div>
        <Button onClick={saveConfiguration} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      {/* Configuration Sections */}
      <div className="space-y-6">
        {config.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {section.icon}
                {section.title}
              </CardTitle>
              <p className="text-sm text-gray-600">{section.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                    <Label htmlFor={field.key}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.key}
                        value={field.value}
                        onChange={(e) => updateField(section.id, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type}
                        value={field.value}
                        onChange={(e) => updateField(section.id, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Database Connection Test */}
              {section.id === "database" && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={testDatabaseConnection}
                      disabled={testingConnection}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <RefreshCw className={`w-4 h-4 ${testingConnection ? "animate-spin" : ""}`} />
                      {testingConnection ? "Testing..." : "Test Connection"}
                    </Button>

                    {connectionStatus && (
                      <Alert
                        className={`flex-1 ${connectionStatus === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                      >
                        {connectionStatus === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription
                          className={connectionStatus === "success" ? "text-green-800" : "text-red-800"}
                        >
                          {connectionStatus === "success"
                            ? "Database connection successful!"
                            : "Database connection failed. Please check your settings."}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveConfiguration} disabled={saving} size="lg" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving Configuration..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  )
}
