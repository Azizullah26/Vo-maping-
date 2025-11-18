"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

function Page() {
  const [todos, setTodos] = useState<any[]>([])

  useEffect(() => {
    async function getTodos() {
      try {
        const supabase = getSupabaseClient()
        
        if (!supabase) {
          console.warn("Supabase client not available")
          return
        }

        const { data, error } = await supabase.from("todos").select("*")

        if (error) {
          console.error("Error fetching todos:", error.message)
          return
        }

        if (data && data.length > 0) {
          setTodos(data)
        } else {
          setTodos([])
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
              {todo.title || "Untitled Todo"}
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
