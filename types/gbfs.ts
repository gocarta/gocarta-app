/**
 * GBFS (General Bikeshare Feed Specification) Type Definitions
 * Spec: https://gbfs.org (v2.3)
 */

export interface GBFSResponse<T> {
  last_updated: number;
  ttl: number;
  version?: string;
  data: T;
}

export interface StationInformation {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  capacity?: number;
}

export interface StationInformationData {
  stations: StationInformation[];
}

export interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_docks_available: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  last_reported: number;
}

export interface StationStatusData {
  stations: StationStatus[];
}

// Merged station data combining information and status
export interface Station {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  capacity?: number;
  num_bikes_available: number;
  num_docks_available: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  last_reported: number;
}
