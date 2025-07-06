"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Receipt, Plus, Download, Eye, DollarSign, Calendar, CreditCard } from "lucide-react"

export default function InvoicePage() {
  const router = useRouter()

  const invoices = [
    {
      id: "INV-001",
      client: "Al Ain Municipality",
      project: "Hospital Renovation",
      amount: 459375,
      status: "Paid",
      dueDate: "2024-01-15",
      issueDate: "2024-01-01",
    },
    {
      id: "INV-002",
      client: "Abu Dhabi Police",
      project: "Station Upgrade",
      amount: 312375,
      status: "Pending",
      dueDate: "2024-01-20",
      issueDate: "2024-01-05",
    },
    {
      id: "INV-003",
      client: "Dubai Metro Authority",
      project: "Metro Extension",
      amount: 735000,
      status: "Overdue",
      dueDate: "2024-01-10",
      issueDate: "2023-12-25",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidAmount = invoices.filter((inv) => inv.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingAmount = invoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600">Manage project invoices and payments</p>
            </div>
          </div>
          <button className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">AED {totalAmount.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">AED {paidAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">AED {pendingAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="p-4">
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Receipt className="h-8 w-8 text-rose-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
                    <p className="text-sm text-gray-600">
                      {invoice.client} • {invoice.project}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">AED {invoice.amount.toLocaleString()}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Issued: {invoice.issueDate}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {invoice.dueDate}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
