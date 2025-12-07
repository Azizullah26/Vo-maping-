"use client"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Cable as Cube, Radio, FileText } from "lucide-react"
import styles from "@/styles/saadiyat-view.module.css"

const images = [
  {
    src: "/images/saa1.png",
    alt: "Louvre Abu Dhabi",
  },
  {
    src: "/images/saa2.png",
    alt: "Modern architectural wall",
  },
  {
    src: "/images/saad3.png",
    alt: "Luxury residential development",
  },
]

interface SaadiyatViewProps {
  className?: string
  isVisible: boolean
}

export function SaadiyatView({ className, isVisible }: SaadiyatViewProps) {
  const [showingImage, setShowingImage] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const toggleView = () => {
    alert("3D viewer has been temporarily disabled to reduce deployment size.")
  }

  if (!isVisible) return null

  return (
    <div className={cn("fixed left-4 top-4 z-40 w-[90%] sm:w-[400px] bg-white rounded-lg shadow-lg", className)}>
      <Card>
        <CardContent className="p-4">
          <Carousel className="w-full" onSelect={(index) => setActiveIndex(index)}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 400px, 400px"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          <div className="mt-4 space-y-2">
            <h2 className="text-2xl font-bold">Saadiyat Island</h2>
            <p className="text-sm text-muted-foreground">
              Saadiyat Island is a natural island and a tourism-cultural environmentally friendly project for Emirati
              heritage and culture that is located in Abu Dhabi, United Arab Emirates. The project is located in a
              large, low-lying island, 500 metres off the coast of Abu Dhabi island.
            </p>
          </div>
          <ul className={styles.iconList}>
            <li className={styles.iconItem} onClick={toggleView}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <Cube className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>3D/360o</p>
            </li>
            <li className={styles.iconItem}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <Radio className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>Live</p>
            </li>
            <li className={styles.iconItem}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <FileText className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>Documents</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
