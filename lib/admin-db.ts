import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

let supabaseInstance: ReturnType<typeof createClient> | null = null

function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Project type definition
export interface Project {
  id: string
  name: string
  start_date: string
  end_date: string
  due_days: string
  status: "Active" | "Completed" | "Delayed" | "On Hold" | "Cancelled" | "Pending"
  progress: number
  budget: string
  manager: string
  manager_id: string
  created_at?: string
  updated_at?: string
}

// Fetch all projects from the database
export async function fetchProjects(): Promise<Project[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Exception fetching projects:", error)
    return []
  }
}

// Update a project in the database
export async function updateProject(
  id: string,
  updates: Partial<Project>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase
      .from("projects")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating project:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Exception updating project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Create a new project in the database
export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error("Exception creating project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Delete a project from the database
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Exception deleting project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Initialize the database with sample data if it's empty
export async function initializeDatabase(): Promise<void> {
  const supabase = getSupabase()
  const { data } = await supabase.from("projects").select("id").limit(1)

  // If there's already data, don't initialize
  if (data && data.length > 0) {
    return
  }

  // Sample project data
  const sampleProjects = [
    {
      name: "مركز شرطة الساد",
      start_date: "2023-01-15",
      end_date: "2024-12-30",
      due_days: "250 days",
      status: "Active",
      progress: 45,
      budget: "AED 24,500,000",
      manager: "Mohammed Al Shamsi",
      manager_id: "MS001",
    },
    {
      name: "مركز شرطة هيلي",
      start_date: "2022-08-22",
      end_date: "2024-06-30",
      due_days: "87 days",
      status: "Active",
      progress: 78,
      budget: "AED 18,750,000",
      manager: "Ahmed Al Dhaheri",
      manager_id: "AD002",
    },
    {
      name: "مركز شرطة الهير",
      start_date: "2023-11-10",
      end_date: "2025-04-15",
      due_days: "471 days",
      status: "Pending",
      progress: 10,
      budget: "AED 31,200,000",
      manager: "Khalid Al Mansoori",
      manager_id: "KM003",
    },
    {
      name: "مركز شرطة سويحان",
      start_date: "2022-02-28",
      end_date: "2023-11-15",
      due_days: "Completed",
      status: "Completed",
      progress: 100,
      budget: "AED 15,800,000",
      manager: "Sara Al Naqbi",
      manager_id: "SN004",
    },
    {
      name: "مركز شرطة المربعة",
      start_date: "2023-05-12",
      end_date: "2024-09-30",
      due_days: "158 days",
      status: "Active",
      progress: 65,
      budget: "AED 22,300,000",
      manager: "Fatima Al Kaabi",
      manager_id: "FK005",
    },
    {
      name: "مركز شرطة زاخر",
      start_date: "2023-08-05",
      end_date: "2025-02-28",
      due_days: "395 days",
      status: "Delayed",
      progress: 32,
      budget: "AED 19,600,000",
      manager: "Hamdan Al Blooshi",
      manager_id: "HB006",
    },
    {
      name: "مركز شرطة الخبيصي",
      start_date: "2023-03-20",
      end_date: "2024-08-15",
      due_days: "112 days",
      status: "Active",
      progress: 55,
      budget: "AED 17,400,000",
      manager: "Mariam Al Suwaidi",
      manager_id: "MS007",
    },
    {
      name: "مركز شرطة الطوية",
      start_date: "2022-12-01",
      end_date: "2024-05-30",
      due_days: "35 days",
      status: "Completed",
      progress: 88,
      budget: "AED 14,900,000",
      manager: "Saeed Al Ahbabi",
      manager_id: "SA008",
    },
  ]

  // Insert sample data
  for (const project of sampleProjects) {
    await createProject(project as any)
  }
}
