"use client"

import dynamic from "next/dynamic"

const DynamicWeatherWidget = dynamic(() => import("./DynamicWeatherWidget"), {
  ssr: false,
  loading: () => (
    <div className="w-[160px] xxs:w-[170px] xs:w-[180px] sm:w-[203px] h-[180px] xxs:h-[190px] xs:h-[200px] bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg animate-pulse" />
  ),
})

import { Wind, Droplets, Sun, ArrowDown } from "lucide-react"

import { useState, useEffect } from "react"

export function WeatherWidget() {
  const [currentTime, setCurrentTime] = useState("")
  const [temperature, setTemperature] = useState(0)
  const [weatherCondition, setWeatherCondition] = useState("")
  const [feelsLike, setFeelsLike] = useState(0)
  const [windSpeed, setWindSpeed] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [uvIndex, setUvIndex] = useState(0)
  const [pressure, setPressure] = useState(0)

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateCurrentTime()
    const intervalId = setInterval(updateCurrentTime, 60000)

    setTemperature(30)
    setWeatherCondition("Sunny")
    setFeelsLike(35)
    setWindSpeed(15)
    setHumidity(50)
    setUvIndex(8)
    setPressure(1012)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 xxs:p-2.5 xs:p-3 sm:p-4 text-white shadow-lg w-[160px] xxs:w-[170px] xs:w-[180px] sm:w-[203px]">
      <div className="flex items-center justify-between mb-1.5 xxs:mb-2">
        <h3 className="text-xs xxs:text-sm sm:text-base font-semibold">Abu Dhabi</h3>
        <span className="text-[10px] xxs:text-xs sm:text-sm">{currentTime}</span>
      </div>
      <div className="flex items-center mb-1.5 xxs:mb-2">
        <div className="text-2xl xxs:text-2xl xs:text-3xl sm:text-4xl font-bold">{temperature}°</div>
        <div className="ml-2">
          <div className="text-[10px] xxs:text-xs sm:text-sm">{weatherCondition}</div>
          <div className="text-[8px] xxs:text-[9px] xs:text-xs text-gray-300">Feels like {feelsLike}°</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 text-[8px] xxs:text-[9px] xs:text-xs">
        <div className="flex items-center">
          <Wind className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 sm:h-3 sm:w-3 mr-1" />
          <span>{windSpeed} km/h</span>
        </div>
        <div className="flex items-center">
          <Droplets className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 sm:h-3 sm:w-3 mr-1" />
          <span>{humidity}%</span>
        </div>
        <div className="flex items-center">
          <Sun className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 sm:h-3 sm:w-3 mr-1" />
          <span>UV: {uvIndex}</span>
        </div>
        <div className="flex items-center">
          <ArrowDown className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 sm:h-3 sm:w-3 mr-1" />
          <span>{pressure} hPa</span>
        </div>
      </div>
    </div>
  )
}
