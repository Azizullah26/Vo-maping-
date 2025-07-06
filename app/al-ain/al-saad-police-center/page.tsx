"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Phone, Clock, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const SaadPoliceStationMap = dynamic(() => import("@/components/SaadPoliceStationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

const policeStationInfo = {
  name: "Al Saad Police Center",
  nameAr: "مركز شرطة السعد",
  address: "Al Saad District, Al Ain",
  addressAr: "منطقة السعد، العين",
  phone: "+971 3 123 4567",
  emergency: "999",
  coordinates: [55.7558, 24.2084] as [number, number],
  services: ["Emergency Response", "Traffic Services", "Community Policing", "Criminal Investigation", "Public Safety"],
  servicesAr: ["الاستجابة للطوارئ", "خدمات المرور", "الشرطة المجتمعية", "التحقيق الجنائي", "السلامة العامة"],
  operatingHours: "24/7",
  staff: "45 Officers",
}

export default function AlSaadPoliceCenterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "contact">("overview")

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{policeStationInfo.name}</h1>
              <p className="text-gray-400">{policeStationInfo.nameAr}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
              {[
                { id: "overview", label: "Overview" },
                { id: "services", label: "Services" },
                { id: "contact", label: "Contact" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Station Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white">{policeStationInfo.address}</p>
                        <p className="text-gray-300 text-sm">{policeStationInfo.addressAr}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">Operating Hours</p>
                        <p className="text-white">{policeStationInfo.operatingHours}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Staff</p>
                        <p className="text-white">{policeStationInfo.staff}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-sm text-gray-400">Emergency</p>
                        <p className="text-white font-bold">{policeStationInfo.emergency}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">About the Station</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Al Saad Police Center serves as a vital law enforcement hub in the Al Saad district of Al Ain. The
                      station provides comprehensive police services to the local community, including emergency
                      response, traffic management, and community policing initiatives. With a dedicated team of 45
                      officers, the center operates 24/7 to ensure public safety and security in the area.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "services" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Available Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">English</h3>
                      <ul className="space-y-2">
                        {policeStationInfo.services.map((service, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-gray-300">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">العربية</h3>
                      <ul className="space-y-2">
                        {policeStationInfo.servicesAr.map((service, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-gray-300">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "contact" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">General Inquiries</p>
                        <p className="text-white font-mono">{policeStationInfo.phone}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Emergency Line</p>
                        <p className="text-red-400 font-bold font-mono text-xl">{policeStationInfo.emergency}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="text-white">{policeStationInfo.address}</p>
                        <p className="text-gray-300">{policeStationInfo.addressAr}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Coordinates</p>
                        <p className="text-white font-mono">
                          {policeStationInfo.coordinates[1].toFixed(6)}, {policeStationInfo.coordinates[0].toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">Important Notes</h3>
                    <ul className="space-y-1 text-gray-300">
                      <li>• For emergencies, always call 999</li>
                      <li>• Non-emergency services available during business hours</li>
                      <li>• Arabic and English speaking officers available</li>
                      <li>• Parking available on-site</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <SaadPoliceStationMap />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Emergency (999)
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Station
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Station Status */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Station Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-semibold">Operational</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white">&lt; 5 minutes</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Officers on Duty</span>
                  <span className="text-white">12/45</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-gray-400 text-sm">2 minutes ago</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white">Patrol completed</span>
                  </div>
                  <p className="text-gray-400 text-xs">15 minutes ago</p>
                </div>

                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white">Traffic incident resolved</span>
                  </div>
                  <p className="text-gray-400 text-xs">1 hour ago</p>
                </div>

                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-white">Community meeting</span>
                  </div>
                  <p className="text-gray-400 text-xs">3 hours ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
