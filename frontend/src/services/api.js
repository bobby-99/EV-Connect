// API client service for EVConnect Backend

const BASE_URL = '/api';

export async function fetchStations() {
  const res = await fetch(`${BASE_URL}/stations`);
  if (!res.ok) throw new Error('Failed to fetch stations');
  return res.json();
}

export async function fetchStationDetail(id) {
  const res = await fetch(`${BASE_URL}/stations/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch station ${id}`);
  return res.json();
}

export async function fetchNearbyStations(lat, lng, radius = 10) {
  const query = new URLSearchParams({ lat, lng, radius }).toString();
  const res = await fetch(`${BASE_URL}/stations/nearby?${query}`);
  if (!res.ok) throw new Error('Failed to fetch nearby stations');
  return res.json();
}

export async function fetchNearestAvailable(lat = 12.9716, lng = 77.5946, radius = 25) {
  const query = new URLSearchParams({ lat, lng, radius }).toString();
  const res = await fetch(`${BASE_URL}/stations/nearest-available?${query}`);
  if (!res.ok) throw new Error('Failed to fetch nearest available stations');
  return res.json();
}

export async function fetchWaitTimePrediction(id) {
  const res = await fetch(`${BASE_URL}/stations/${id}/predict-wait`);
  if (!res.ok) throw new Error(`Failed to fetch wait prediction for station ${id}`);
  return res.json();
}

export async function fetchStationHeatmap(id) {
  const res = await fetch(`${BASE_URL}/stations/${id}/heatmap`);
  if (!res.ok) throw new Error(`Failed to fetch heatmap for station ${id}`);
  return res.json();
}

export async function createBooking(bookingPayload) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create booking reservation');
  }
  return data;
}

export async function fetchBookingDetails(id) {
  const res = await fetch(`${BASE_URL}/bookings/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch booking ${id}`);
  return res.json();
}

export async function planTrip(tripPayload) {
  const res = await fetch(`${BASE_URL}/trip-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripPayload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to calculate trip plan');
  }
  return data;
}
