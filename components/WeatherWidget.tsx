import dynamic from "next/dynamic"

const DynamicWeatherWidget = dynamic(() => import("./DynamicWeatherWidget"), {
  ssr: false,
  loading: () => (
    <div className="w-[203px] h-[200px] bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg animate-pulse" />
  ),
})

export function WeatherWidget() {
  return <DynamicWeatherWidget />
}
