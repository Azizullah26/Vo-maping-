import Image from "next/image"

export default function InfoPanel({ location }) {
  if (!location) return null

  return (
    <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Building Info</h2>
      <Image src="/placeholder.svg" alt="Building" width={200} height={200} className="mb-4 rounded" />
      <p>
        <strong>Project Name:</strong> Example Project
      </p>
      <p>
        <strong>Description:</strong> This is an example building description.
      </p>
    </div>
  )
}
