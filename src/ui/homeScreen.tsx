import { ContactCardContainer } from "@/lib/ContactCard";
import { getCards } from "@/lib/db";
import { buttonAdd } from "@/lib/icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { DisplayCard } from "./displayCard";

export default function Home() {
  const carouselRef = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");
  const progress = useSharedValue<number>(0);
  const router = useRouter();
  const db = useSQLiteContext();
  const fetchDb = useCallback(async () => {
    getCards(db)
      .then((cards) => {
        setContactCardContainers(cards);
      })
      .catch((error) => console.log(error));
  }, [db]);
  const [contactCardContainers, setContactCardContainers] =
    useState<ContactCardContainer[]>();
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDb();
    setRefreshing(false);
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchDb();
    }, [db]),
  );
  function onPressPagination(index: number) {
    carouselRef.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  }
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Carousel
            width={width}
            height={height * 0.8}
            ref={carouselRef}
            style={{
              flex: 1,
              justifyContent: "center",
            }}
            data={contactCardContainers ?? []}
            onProgressChange={progress}
            renderItem={({ item, index }) => (
              <View style={styles.carouselCard}>
                <DisplayCard
                  key={index}
                  cardContainer={item}
                  fetchDb={fetchDb}
                />
              </View>
            )}
          />
        </View>
      </ScrollView>
      <View>
        <Pagination.Basic
          progress={progress}
          data={contactCardContainers ?? []}
          dotStyle={styles.paginationDots}
          containerStyle={styles.paginationContainer}
          onPress={onPressPagination}
        />
      </View>
      <View style={styles.buttonsBottom}>
        <Pressable
          onPress={() => {
            router.navigate("/new");
          }}
        >
          <Image
            source={buttonAdd}
            resizeMode="contain"
            style={{ width: 64, height: 64 }}
          />
        </Pressable>
        {/* <Button
            title="test"
            onPress={() => {
              router.navigate("/test");
            }}
          /> */}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: { flexGrow: 1 },
  buttonsBottom: {
    flex: 1,
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paginationContainer: {
    position: "absolute",
    gap: 5,
    marginTop: 10,
    bottom: 96,
  },
  paginationDots: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 50,
  },
  carouselCard: {
    flex: 1,
    margin: 16,
    justifyContent: "center",
  },
});
