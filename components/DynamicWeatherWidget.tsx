import { Sun } from "lucide-react"

export default function DynamicWeatherWidget() {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 rounded-lg w-[203px] h-[200px] flex flex-col items-center justify-between">
      <h2 className="text-white text-lg font-semibold">UAE</h2>
      <div className="flex items-center justify-center">
        <Sun className="w-12 h-12 text-yellow-400" />
      </div>
      <div className="text-white text-3xl font-bold">35°C</div>
      <div className="text-white text-sm">Clear Sky</div>
      <div className="flex justify-between w-full text-white text-xs">
        <span>Humidity: 45%</span>
        <span>Wind: 12 km/h</span>
      </div>
    </div>
  )
}
