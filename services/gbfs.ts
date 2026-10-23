import type {
  GBFSResponse,
  StationInformationData,
  StationStatusData,
  Station,
} from '@/types/gbfs';

const STATION_INFO_URL =
  'https://chattanooga.publicbikesystem.net/customer/gbfs/v2/en/station_information';
const STATION_STATUS_URL =
  'https://chattanooga.publicbikesystem.net/customer/gbfs/v2/en/station_status';

async function fetchStationInformation(): Promise<GBFSResponse<StationInformationData>> {
  const response = await fetch(STATION_INFO_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch station information: ${response.statusText}`);
  }
  return response.json();
}

async function fetchStationStatus(): Promise<GBFSResponse<StationStatusData>> {
  const response = await fetch(STATION_STATUS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch station status: ${response.statusText}`);
  }
  return response.json();
}

function mergeStationData(
  information: GBFSResponse<StationInformationData>,
  status: GBFSResponse<StationStatusData>
): Station[] {
  const stations: Station[] = [];

  const statusMap = new Map(
    status.data.stations.map((s) => [s.station_id, s])
  );

  for (const info of information.data.stations) {
    const statusData = statusMap.get(info.station_id);

    if (!statusData) {
      continue;
    }

    stations.push({
      station_id: info.station_id,
      name: info.name,
      lat: info.lat,
      lon: info.lon,
      address: info.address,
      capacity: info.capacity,
      num_bikes_available: statusData.num_bikes_available,
      num_docks_available: statusData.num_docks_available,
      is_installed: statusData.is_installed,
      is_renting: statusData.is_renting,
      is_returning: statusData.is_returning,
      last_reported: statusData.last_reported,
    });
  }

  return stations;
}

export async function getBikeStations(): Promise<Station[]> {
  try {
    const [information, status] = await Promise.all([
      fetchStationInformation(),
      fetchStationStatus(),
    ]);

    return mergeStationData(information, status);
  } catch (error) {
    console.error('Error fetching bike station data:', error);
    throw error;
  }
}
