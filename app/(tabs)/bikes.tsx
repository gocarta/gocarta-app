import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BikeStationList } from '@/components/bike-station-list';
import { useBikeStations } from '@/hooks/use-bike-stations';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function BikesScreen() {
  const { stations, loading, error, refresh } = useBikeStations();

  const Header = () => (
    <View>
      <ThemedView style={styles.headerContainer}>
        <IconSymbol
          size={60}
          color="#808080"
          name="bicycle"
          style={styles.headerIcon}
        />
      </ThemedView>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bike Chattanooga</ThemedText>
      </ThemedView>

      <ThemedView style={styles.descriptionContainer}>
        <ThemedText>
          Find available bikes and docking stations throughout downtown Chattanooga.
        </ThemedText>
      </ThemedView>
    </View>
  );

  return (
    <BikeStationList
      stations={stations}
      loading={loading}
      error={error}
      onRefresh={refresh}
      ListHeaderComponent={Header}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerIcon: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
