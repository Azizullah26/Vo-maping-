"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  ImageIcon,
  Video,
  FileText,
  Download,
  Eye,
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  thumbnail?: string;
  size: number;
  uploadDate: string;
  project?: string;
  tags: string[];
  description?: string;
}

const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    name: "Al Ain Cultural Center - Exterior View",
    type: "image",
    url: "/placeholder.svg?height=400&width=600&text=Cultural+Center+Exterior",
    thumbnail:
      "/placeholder.svg?height=200&width=300&text=Cultural+Center+Exterior",
    size: 2048576, // 2MB
    uploadDate: "2024-01-15",
    project: "16-projects",
    tags: ["architecture", "exterior", "cultural-center"],
    description:
      "Exterior architectural view of the Al Ain Cultural Center showing modern design elements",
  },
  {
    id: "2",
    name: "Construction Progress Video - Week 12",
    type: "video",
    url: "/placeholder-video.mp4",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Construction+Video",
    size: 15728640, // 15MB
    uploadDate: "2024-01-12",
    project: "7-projects",
    tags: ["construction", "progress", "timelapse"],
    description: "Weekly construction progress documentation",
  },
  {
    id: "3",
    name: "Project Specifications Document",
    type: "document",
    url: "/placeholder-document.pdf",
    size: 1048576, // 1MB
    uploadDate: "2024-01-10",
    project: "2-projects",
    tags: ["specifications", "technical", "planning"],
    description: "Detailed project specifications and requirements",
  },
  {
    id: "4",
    name: "Al Ain Oasis Aerial Photography",
    type: "image",
    url: "/placeholder.svg?height=400&width=600&text=Oasis+Aerial",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Oasis+Aerial",
    size: 3145728, // 3MB
    uploadDate: "2024-01-08",
    project: "1-project",
    tags: ["aerial", "oasis", "landscape"],
    description:
      "Drone photography of Al Ain Oasis showing the natural landscape",
  },
  {
    id: "5",
    name: "Police Station Interior Design",
    type: "image",
    url: "/placeholder.svg?height=400&width=600&text=Police+Interior",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Police+Interior",
    size: 1572864, // 1.5MB
    uploadDate: "2024-01-05",
    project: "al-saad-police",
    tags: ["interior", "police", "design"],
    description: "Interior design concept for Al Saad Police Center",
  },
];

export default function MediaPage() {
  const router = useRouter();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems);
  const [filteredItems, setFilteredItems] =
    useState<MediaItem[]>(mockMediaItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    let filtered = mediaItems;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    // Apply project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter((item) => item.project === projectFilter);
    }

    setFilteredItems(filtered);
  }, [searchTerm, typeFilter, projectFilter, mediaItems]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-green-100 text-green-800";
      case "video":
        return "bg-blue-100 text-blue-800";
      case "document":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 border-b border-cyan-400 shadow-lg shadow-cyan-400/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-cyan-100 hover:bg-cyan-600/20 border border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Al Ain
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
                Media Gallery
              </h1>
              <p className="text-cyan-300">
                Browse project media and documents
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="mb-6 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border-cyan-400 border-2 shadow-lg shadow-cyan-400/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
                  <Input
                    placeholder="Search media..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gradient-to-r from-slate-800 to-blue-900 border-cyan-400 text-cyan-100 placeholder-cyan-300 focus:border-cyan-300 focus:ring-cyan-300 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="w-full md:w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-gradient-to-r from-slate-800 to-blue-900 border-cyan-400 text-cyan-100 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-slate-900 to-blue-900 border-cyan-400">
                    <SelectItem
                      value="all"
                      className="text-cyan-100 hover:bg-cyan-600/20"
                    >
                      All Types
                    </SelectItem>
                    <SelectItem
                      value="image"
                      className="text-cyan-100 hover:bg-cyan-600/20"
                    >
                      Images
                    </SelectItem>
                    <SelectItem
                      value="video"
                      className="text-cyan-100 hover:bg-cyan-600/20"
                    >
                      Videos
                    </SelectItem>
                    <SelectItem
                      value="document"
                      className="text-cyan-100 hover:bg-cyan-600/20"
                    >
                      Documents
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Filter */}
              <div className="w-full md:w-48">
                {/* Project filter implementation goes here */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={
                item.name === "Al Ain Cultural Center - Exterior View"
                  ? "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border-cyan-400 border-2 shadow-lg shadow-cyan-400/20"
                  : "bg-gray-800 border-gray-700"
              }
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    item.name === "Al Ain Cultural Center - Exterior View"
                      ? "text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text font-bold"
                      : ""
                  }`}
                >
                  {getTypeIcon(item.type)}
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm ${
                        item.name === "Al Ain Cultural Center - Exterior View"
                          ? "text-cyan-300"
                          : "text-gray-400"
                      }`}
                    >
                      Uploaded on {item.uploadDate}
                    </p>
                    <p
                      className={`text-sm ${
                        item.name === "Al Ain Cultural Center - Exterior View"
                          ? "text-cyan-300"
                          : "text-gray-400"
                      }`}
                    >
                      Size: {formatFileSize(item.size)}
                    </p>
                    {item.project && (
                      <p
                        className={`text-sm ${
                          item.name === "Al Ain Cultural Center - Exterior View"
                            ? "text-purple-300"
                            : "text-gray-400"
                        }`}
                      >
                        Project: {item.project}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className={
                          item.name === "Al Ain Cultural Center - Exterior View"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border border-cyan-400 shadow-md shadow-cyan-400/30"
                            : "bg-gray-700 text-white"
                        }
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className={
                      item.name === "Al Ain Cultural Center - Exterior View"
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300"
                        : "bg-gray-700 border-gray-600 text-white"
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    className={
                      item.name === "Al Ain Cultural Center - Exterior View"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-400/30 transition-all duration-300"
                        : "bg-gray-700 border-gray-600 text-white"
                    }
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
