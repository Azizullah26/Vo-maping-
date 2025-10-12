import TopNav from "@/components/TopNav"
import Image from "next/image"
import Link from "next/link"
import DocumentsList from "@/components/DocumentsList"

export default function AlSaadPoliceCenter() {
  return (
    <main className="min-h-screen bg-white">
      <TopNav />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/al-ain" className="text-blue-600 hover:text-blue-800 mr-2">
            ← Back to Al Ain
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 sm:h-80">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="مركز شرطة الساد"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">مركز شرطة الساد</h1>
                <h2 className="text-xl text-gray-700">Al Saad Police Center</h2>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Operational
                </span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                مركز شرطة الساد هو مركز أمني يخدم منطقة الساد في مدينة العين. يقدم المركز خدمات أمنية متكاملة للمواطنين
                والمقيمين في المنطقة.
              </p>
              <p className="text-gray-600 mb-4">
                Al Saad Police Center is a security facility serving the Al Saad area in Al Ain city. The center
                provides comprehensive security services to citizens and residents in the area.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Services</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Filing police reports</li>
                <li>Traffic accident processing</li>
                <li>Community security services</li>
                <li>Administrative services</li>
                <li>Emergency response</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Contact Information</h3>
              <p className="text-gray-600">
                <strong>Phone:</strong> +971-3-XXXXXXX
                <br />
                <strong>Email:</strong> alsaad.police@adpolice.gov.ae
                <br />
                <strong>Working Hours:</strong> 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Add the Documents List component with the exact project ID */}
        <div className="mb-8">
          <DocumentsList projectId="al-saad-police-center" />
        </div>
      </div>
    </main>
  )
}
