"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
;<style jsx>{`
     .text-shadow {
       text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
     }
   `}</style>

interface Project {
  id: number
  name: string
  startDate: string
  endDate: string
  progress: number
  teamMembers: number
  contractorName: string
  contractEngineer: string
  policeDepartmentEngineer: string
  challenges: string
  amount: number
  workOrderNumber: string
}

const projects: Project[] = [
  {
    id: 1,
    name: "Abu Dhabi Central Park",
    startDate: "2023-01-15",
    endDate: "2025-06-30",
    progress: 35,
    teamMembers: 150,
    contractorName: "EL RACE",
    contractEngineer: "Mohammed Al Hashimi",
    policeDepartmentEngineer: "Khalid Al Mansoori",
    challenges: "Soil stabilization, Water management",
    amount: 500000000,
    workOrderNumber: "WO-2023-001",
  },
  {
    id: 2,
    name: "Sheikh Zayed Bridge Expansion",
    startDate: "2023-03-01",
    endDate: "2024-12-31",
    progress: 20,
    teamMembers: 200,
    contractorName: "Arabtec Construction",
    contractEngineer: "Sara Al Naqbi",
    policeDepartmentEngineer: "Ahmed Al Zaabi",
    challenges: "Traffic management, Structural integrity",
    amount: 750000000,
    workOrderNumber: "WO-2023-002",
  },
  {
    id: 3,
    name: "Project 3",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 3",
    contractEngineer: "Engineer 3",
    policeDepartmentEngineer: "Engineer 3",
    challenges: "Challenge 3",
    amount: 100000000,
    workOrderNumber: "WO-2024-003",
  },
  {
    id: 4,
    name: "Project 4",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 4",
    contractEngineer: "Engineer 4",
    policeDepartmentEngineer: "Engineer 4",
    challenges: "Challenge 4",
    amount: 100000000,
    workOrderNumber: "WO-2024-004",
  },
  {
    id: 5,
    name: "Project 5",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 5",
    contractEngineer: "Engineer 5",
    policeDepartmentEngineer: "Engineer 5",
    challenges: "Challenge 5",
    amount: 100000000,
    workOrderNumber: "WO-2024-005",
  },
  {
    id: 6,
    name: "Project 6",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 6",
    contractEngineer: "Engineer 6",
    policeDepartmentEngineer: "Engineer 6",
    challenges: "Challenge 6",
    amount: 100000000,
    workOrderNumber: "WO-2024-006",
  },
  {
    id: 7,
    name: "Project 7",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 7",
    contractEngineer: "Engineer 7",
    policeDepartmentEngineer: "Engineer 7",
    challenges: "Challenge 7",
    amount: 100000000,
    workOrderNumber: "WO-2024-007",
  },
  {
    id: 8,
    name: "Project 8",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 8",
    contractEngineer: "Engineer 8",
    policeDepartmentEngineer: "Engineer 8",
    challenges: "Challenge 8",
    amount: 100000000,
    workOrderNumber: "WO-2024-008",
  },
  {
    id: 9,
    name: "Project 9",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 9",
    contractEngineer: "Engineer 9",
    policeDepartmentEngineer: "Engineer 9",
    challenges: "Challenge 9",
    amount: 100000000,
    workOrderNumber: "WO-2024-009",
  },
  {
    id: 10,
    name: "Project 10",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 10",
    contractEngineer: "Engineer 10",
    policeDepartmentEngineer: "Engineer 10",
    challenges: "Challenge 10",
    amount: 100000000,
    workOrderNumber: "WO-2024-010",
  },
  {
    id: 11,
    name: "Project 11",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 11",
    contractEngineer: "Engineer 11",
    policeDepartmentEngineer: "Engineer 11",
    challenges: "Challenge 11",
    amount: 100000000,
    workOrderNumber: "WO-2024-011",
  },
  {
    id: 12,
    name: "Project 12",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 12",
    contractEngineer: "Engineer 12",
    policeDepartmentEngineer: "Engineer 12",
    challenges: "Challenge 12",
    amount: 100000000,
    workOrderNumber: "WO-2024-012",
  },
  {
    id: 13,
    name: "Project 13",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 13",
    contractEngineer: "Engineer 13",
    policeDepartmentEngineer: "Engineer 13",
    challenges: "Challenge 13",
    amount: 100000000,
    workOrderNumber: "WO-2024-013",
  },
  {
    id: 14,
    name: "Project 14",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 14",
    contractEngineer: "Engineer 14",
    policeDepartmentEngineer: "Engineer 14",
    challenges: "Challenge 14",
    amount: 100000000,
    workOrderNumber: "WO-2024-014",
  },
  {
    id: 15,
    name: "Project 15",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 15",
    contractEngineer: "Engineer 15",
    policeDepartmentEngineer: "Engineer 15",
    challenges: "Challenge 15",
    amount: 100000000,
    workOrderNumber: "WO-2024-015",
  },
  {
    id: 16,
    name: "Project 16",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 16",
    contractEngineer: "Engineer 16",
    policeDepartmentEngineer: "Engineer 16",
    challenges: "Challenge 16",
    amount: 100000000,
    workOrderNumber: "WO-2024-016",
  },
  {
    id: 17,
    name: "Project 17",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 17",
    contractEngineer: "Engineer 17",
    policeDepartmentEngineer: "Engineer 17",
    challenges: "Challenge 17",
    amount: 100000000,
    workOrderNumber: "WO-2024-017",
  },
  {
    id: 18,
    name: "Project 18",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 18",
    contractEngineer: "Engineer 18",
    policeDepartmentEngineer: "Engineer 18",
    challenges: "Challenge 18",
    amount: 100000000,
    workOrderNumber: "WO-2024-018",
  },
  {
    id: 19,
    name: "Project 19",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 19",
    contractEngineer: "Engineer 19",
    policeDepartmentEngineer: "Engineer 19",
    challenges: "Challenge 19",
    amount: 100000000,
    workOrderNumber: "WO-2024-019",
  },
  {
    id: 20,
    name: "Project 20",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 10,
    teamMembers: 50,
    contractorName: "Contractor 20",
    contractEngineer: "Engineer 20",
    policeDepartmentEngineer: "Engineer 20",
    challenges: "Challenge 20",
    amount: 100000000,
    workOrderNumber: "WO-2024-020",
  },
]

export function AbuDhabiProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-teal-300/50 via-orange-300/50 to-fuchsia-900/50">
      <h2 className="text-2xl font-bold mb-4 text-black text-shadow">Abu Dhabi Projects</h2>
      <div className="flex-grow flex flex-col items-center w-full max-w-3xl overflow-hidden">
        <ScrollArea className="w-full mb-4 bg-white/5 backdrop-filter backdrop-blur-sm rounded-lg">
          <div className="space-y-2 p-2">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant={selectedProject?.id === project.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-black transition-colors duration-200 ease-in-out",
                  selectedProject?.id === project.id
                    ? "bg-[#1B1464] text-white hover:bg-[#1B1464]/80"
                    : "hover:bg-[#E31E24]/20",
                )}
                onClick={() => setSelectedProject(project)}
              >
                {project.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="w-full bg-white/5 backdrop-filter backdrop-blur-sm rounded-lg p-4">
          {selectedProject ? (
            <div className="space-y-4 text-black">
              <h3 className="text-xl font-semibold text-black border-b-2 border-[#E31E24] pb-2">
                {selectedProject.name}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-[#00008B]">Start Date:</strong>{" "}
                  <span className="text-black">{selectedProject.startDate}</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">End Date:</strong>{" "}
                  <span className="text-black">{selectedProject.endDate}</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">Progress:</strong>{" "}
                  <span className="text-black">{selectedProject.progress}%</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">Team Members:</strong>{" "}
                  <span className="text-black">{selectedProject.teamMembers}</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">Contractor Name:</strong>{" "}
                  <span className="text-black">{selectedProject.contractorName}</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">Contract Engineer:</strong>{" "}
                  <span className="text-black">{selectedProject.contractEngineer}</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">Police Department Engineer:</strong>{" "}
                  <span className="text-black">{selectedProject.policeDepartmentEngineer}</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">Challenges:</strong>{" "}
                  <span className="text-black">{selectedProject.challenges}</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">Amount:</strong>{" "}
                  <span className="text-black">AED {selectedProject.amount.toLocaleString()}</span>
                </div>
                <div>
                  <strong className="text-[#00008B]">Work Order Number:</strong>{" "}
                  <span className="text-black">{selectedProject.workOrderNumber}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-black/70 italic text-center">
              Select a project to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
