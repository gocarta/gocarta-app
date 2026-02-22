import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Station } from '@/types/gbfs';
import { ActivityIndicator, FlatList, Linking, StyleSheet, View } from 'react-native';

interface BikeStationListProps {
  stations: Station[];
  loading: boolean;
  error: Error | null;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function BikeStationList({ stations, loading, error, onRefresh, ListHeaderComponent }: BikeStationListProps) {
  if (loading && stations.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading bike stations...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="subtitle" style={styles.errorText}>
          Error Loading Stations
        </ThemedText>
        <ThemedText>{error.message}</ThemedText>
      </ThemedView>
    );
  }

  if (stations.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>No bike stations found.</ThemedText>
      </ThemedView>
    );
  }

  const openInMaps = (station: Station) => {
    const searchTerm = encodeURIComponent(station.address || station.name);
    const url = `https://www.google.com/maps/search/${searchTerm}/@${station.lat},${station.lon},17z`;
    Linking.openURL(url);
  };

  const renderStation = ({ item }: { item: Station }) => {
    const isAvailable = item.is_installed && item.is_renting;
    
    return (
      <ThemedView style={styles.stationCard}>
        <View style={styles.stationHeader}>
          <ThemedText type="defaultSemiBold" style={styles.stationName}>
            {item.name}
          </ThemedText>
          {!isAvailable && (
            <ThemedText style={styles.unavailableText}>Unavailable</ThemedText>
          )}
        </View>

        {item.address && (
          <ThemedText style={styles.address}>{item.address}</ThemedText>
        )}

        <View style={styles.availabilityContainer}>
          <View style={styles.availabilityItem}>
            <ThemedText type="defaultSemiBold" style={styles.availabilityNumber}>
              {item.num_bikes_available}
            </ThemedText>
            <ThemedText style={styles.availabilityLabel}>Bikes</ThemedText>
          </View>

          <View style={styles.availabilityItem}>
            <ThemedText type="defaultSemiBold" style={styles.availabilityNumber}>
              {item.num_docks_available}
            </ThemedText>
            <ThemedText style={styles.availabilityLabel}>Docks</ThemedText>
          </View>

          {item.capacity && (
            <View style={styles.availabilityItem}>
              <ThemedText type="defaultSemiBold" style={styles.availabilityNumber}>
                {item.capacity}
              </ThemedText>
              <ThemedText style={styles.availabilityLabel}>Total</ThemedText>
            </View>
          )}
        </View>

        <ThemedText
          style={styles.viewMapLink}
          onPress={() => openInMaps(item)}
        >
          View on Map →
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <FlatList
      data={stations}
      renderItem={renderStation}
      keyExtractor={(item) => item.station_id}
      contentContainerStyle={styles.listContainer}
      refreshing={loading}
      onRefresh={onRefresh}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
  },
  stationCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stationName: {
    fontSize: 16,
    flex: 1,
  },
  unavailableText: {
    fontSize: 12,
    color: '#ff4444',
  },
  address: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 6,
  },
  availabilityItem: {
    alignItems: 'center',
  },
  availabilityNumber: {
    fontSize: 24,
    marginBottom: 4,
  },
  availabilityLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  viewMapLink: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'right',
    marginTop: 8,
  },
});
