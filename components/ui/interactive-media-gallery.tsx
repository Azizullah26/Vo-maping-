'use client'

import React, { useState, useEffect } from 'react'
import { ImageIcon, Video, FileText, Eye, Download } from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail?: string
  size: number
  uploadDate: string
  project?: string
  tags: string[]
  description?: string
}

interface InteractiveMediaGalleryProps {
  items: MediaItem[]
  onItemSelect?: (item: MediaItem) => void
}

export const InteractiveMediaGallery: React.FC<InteractiveMediaGalleryProps> = ({ items, onItemSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animatedItems, setAnimatedItems] = useState<number[]>([])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={24} className="text-white" />
      case 'video':
        return <Video size={24} className="text-white" />
      case 'document':
        return <FileText size={24} className="text-white" />
      default:
        return <FileText size={24} className="text-white" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'from-cyan-500 to-blue-500'
      case 'video':
        return 'from-purple-500 to-pink-500'
      case 'document':
        return 'from-emerald-500 to-teal-500'
      default:
        return 'from-slate-500 to-gray-500'
    }
  }

  const handleItemClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index)
      if (onItemSelect) {
        onItemSelect(items[index])
      }
    }
  }

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    items.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedItems((prev) => [...prev, i])
      }, 180 * i)
      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [items.length])

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-lg border border-cyan-500/20">
        <p className="text-cyan-300">No media items found</p>
      </div>
    )
  }

  const activeItem = items[activeIndex]

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans text-white py-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl px-6 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg animate-fadeInTop delay-300">
          Project Media Gallery
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto animate-fadeInTop delay-600">
          Explore project images, videos, and documents
        </p>
      </div>

      {/* Gallery Container */}
      <div className="w-full max-w-[1000px] px-4 mb-8">
        {/* Main Expanded View */}
        {activeItem && (
          <div className="mb-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-lg border border-cyan-500/30 overflow-hidden shadow-lg shadow-cyan-900/30 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail */}
              <div className="relative w-full h-80 rounded-lg overflow-hidden border border-cyan-500/20">
                <img
                  src={activeItem.thumbnail || '/placeholder.svg'}
                  alt={activeItem.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.svg?height=400&width=500&text=Media+Not+Found'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 rounded-full text-xs font-semibold">
                  {activeItem.type.charAt(0).toUpperCase() + activeItem.type.slice(1)}
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-4">{activeItem.name}</h2>
                  <p className="text-gray-300 mb-6">{activeItem.description || 'No description available'}</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-cyan-400 font-semibold">Upload Date:</span>
                      <span className="text-gray-300">{activeItem.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-cyan-400 font-semibold">File Size:</span>
                      <span className="text-gray-300">{formatFileSize(activeItem.size)}</span>
                    </div>
                    {activeItem.project && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-cyan-400 font-semibold">Project:</span>
                        <span className="text-gray-300">{activeItem.project}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {activeItem.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {activeItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs border border-cyan-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30">
                    <Eye size={18} />
                    View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 font-semibold py-2 px-4 rounded-lg transition-all duration-300 border border-purple-500/30">
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carousel */}
        <div className="options flex w-full h-[300px] items-stretch overflow-hidden relative rounded-lg">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`
                option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out cursor-pointer
                ${activeIndex === index ? 'active' : ''}
              `}
              style={{
                backgroundImage: `url('${item.thumbnail || '/placeholder.svg'}')`,
                backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
                backgroundPosition: 'center',
                backfaceVisibility: 'hidden',
                opacity: animatedItems.includes(index) ? 1 : 0,
                transform: animatedItems.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
                minWidth: '60px',
                minHeight: '100px',
                margin: 0,
                borderRadius: 0,
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: activeIndex === index ? '#22d3ee' : '#292929',
                backgroundColor: '#18181b',
                boxShadow:
                  activeIndex === index
                    ? '0 20px 60px rgba(0,0,0,0.50), 0 0 30px rgba(34,211,238,0.3)'
                    : '0 10px 30px rgba(0,0,0,0.30)',
                flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
                zIndex: activeIndex === index ? 10 : 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative',
                overflow: 'hidden',
                willChange: 'flex-grow, box-shadow, background-size, background-position',
              }}
              onClick={() => handleItemClick(index)}
            >
              {/* Shadow effect */}
              <div
                className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
                style={{
                  bottom: activeIndex === index ? '0' : '-40px',
                  height: '150px',
                  boxShadow:
                    activeIndex === index
                      ? 'inset 0 -150px 120px -120px #000, inset 0 -150px 120px -80px #000'
                      : 'inset 0 -150px 0px -120px #000, inset 0 -150px 0px -80px #000',
                }}
              ></div>

              {/* Label with icon and info */}
              <div className="label absolute left-0 right-0 bottom-4 flex items-center justify-start h-14 z-20 pointer-events-none px-4 gap-3 w-full">
                <div className={`icon min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-gradient-to-r ${getTypeColor(item.type)} backdrop-blur-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.18)] border-2 border-white/30 flex-shrink-0 flex-grow-0 transition-all duration-200`}>
                  {getTypeIcon(item.type)}
                </div>
                <div className="info text-white whitespace-pre relative">
                  <div
                    className="main font-bold text-lg transition-all duration-700 ease-in-out"
                    style={{
                      opacity: activeIndex === index ? 1 : 0,
                      transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)',
                    }}
                  >
                    {item.name.substring(0, 30)}
                  </div>
                  <div
                    className="sub text-sm text-gray-300 transition-all duration-700 ease-in-out"
                    style={{
                      opacity: activeIndex === index ? 1 : 0,
                      transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)',
                    }}
                  >
                    {item.uploadDate}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
