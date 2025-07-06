"use client" // Mark as client component if it's not already

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase" // Corrected import path

function Page() {
  const [todos, setTodos] = useState<any[]>([]) // Use any[] for flexibility, or define a Todo type

  useEffect(() => {
    async function getTodos() {
      // Mark function as async
      try {
        const { data, error } = await supabase.from("todos").select("*") // Select all columns

        if (error) {
          console.error("Error fetching todos:", error.message)
          // Optionally, set an error state to display to the user
          return
        }

        if (data && data.length > 0) {
          setTodos(data)
        } else {
          setTodos([]) // Ensure todos is empty if no data or empty array
        }
      } catch (err) {
        console.error("Unexpected error:", err)
      }
    }

    getTodos()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Todos</h1>
      {todos.length > 0 ? (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="p-3 border rounded-md bg-white shadow-sm">
              {todo.title || "Untitled Todo"} {/* Assuming a 'title' column */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No todos found. Make sure your 'todos' table exists and has data.</p>
      )}
    </div>
  )
}
export default Page
