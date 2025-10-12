"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function TestComponent() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-medium mb-2">Test Component</h2>
      <p className="mb-2">Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  )
}
