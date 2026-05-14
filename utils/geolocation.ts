// Geolocation utilities for Bangladesh cities

export interface CityCoordinates {
  name: string
  lat: number
  lng: number
  region: string
}

// Major cities in Bangladesh with coordinates
export const bangladeshCities: CityCoordinates[] = [
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125, region: 'dhaka' },
  { name: 'Chittagong', lat: 22.3569, lng: 91.7832, region: 'chittagong' },
  { name: 'Sylhet', lat: 24.8949, lng: 91.8687, region: 'sylhet' },
  { name: 'Rajshahi', lat: 24.3636, lng: 88.6241, region: 'rajshahi' },
  { name: 'Khulna', lat: 22.8456, lng: 89.0405, region: 'khulna' },
  { name: "Cox's Bazar", lat: 21.4274, lng: 92.0058, region: 'coxsBazar' },
  { name: 'Barisal', lat: 22.7010, lng: 90.3586, region: 'barisal' },
  { name: 'Rangpur', lat: 25.7439, lng: 89.2355, region: 'rangpur' },
  { name: 'Mymensingh', lat: 24.7471, lng: 90.4203, region: 'mymensingh' },
  { name: 'Comilla', lat: 23.4607, lng: 91.1809, region: 'comilla' },
]

// Calculate distance between two coordinates in kilometers
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Get nearest city to user's location
export function getNearestCity(userLat: number, userLng: number): CityCoordinates {
  let nearestCity = bangladeshCities[0]
  let minDistance = Infinity

  for (const city of bangladeshCities) {
    const distance = calculateDistance(userLat, userLng, city.lat, city.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearestCity = city
    }
  }

  return nearestCity
}

// Get user's current location
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Get city priority order based on user location
export function getCityPriorityOrder(userLat?: number, userLng?: number): string[] {
  if (!userLat || !userLng) {
    // Default order if no location available
    return ['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'coxsBazar']
  }

  const nearestCity = getNearestCity(userLat, userLng)
  const citiesByDistance = bangladeshCities
    .map(city => ({
      ...city,
      distance: calculateDistance(userLat, userLng, city.lat, city.lng)
    }))
    .sort((a, b) => a.distance - b.distance)

  // Return regions in order of distance
  return citiesByDistance.map(city => city.region)
}

// Check if a location string matches a city
export function matchesCity(location: string, cityRegion: string): boolean {
  if (!location || typeof location !== 'string') return false
  
  const locationLower = location.toLowerCase()
  const city = bangladeshCities.find(c => c.region === cityRegion)
  
  if (!city) return false
  
  // Check various ways the city might be mentioned
  return locationLower.includes(city.name.toLowerCase()) ||
         locationLower.includes(city.region.toLowerCase())
}
