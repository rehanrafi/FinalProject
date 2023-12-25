import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
} from "react-native-heroicons/outline";
import TrendingMovies from "../components/trendingMovies";
import MovieList from "../components/movieList";
import { StatusBar } from "expo-status-bar";
import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../api/moviedb";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../theme";

const ios = Platform.OS === "ios";

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      await getTrendingMovies();
      await getUpcomingMovies();
      await getTopRatedMovies();
      setLoading(false);
    }
    fetchData();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    if (data && data.results) setTrending(data.results);
  };

  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    if (data && data.results) setUpcoming(data.results);
  };

  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    if (data && data.results) setTopRated(data.results);
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    // Implement logic to change theme here...
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: isDarkMode ? "#121212" : "white" }}
    >
      <SafeAreaView style={{ marginBottom: ios ? -2 : 3 }}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={toggleTheme}>
            {isDarkMode ? (
              <SunIcon
                size={30}
                strokeWidth={2}
                color={isDarkMode ? "white" : "black"}
              />
            ) : (
              <MoonIcon
                size={30}
                strokeWidth={2}
                color={isDarkMode ? "white" : "black"}
              />
            )}
          </TouchableOpacity>
          <Text
            style={{
              color: isDarkMode ? "white" : "black", // Adjust text color based on dark/light mode
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              flex: 1,
            }}
          >
            <Text style={styles.text}>Movie Place</Text>
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <MagnifyingGlassIcon
              size={30}
              strokeWidth={2}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "white" : "black"}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {trending.length > 0 && <TrendingMovies data={trending} />}

          {upcoming.length > 0 && (
            <MovieList title="Upcoming" data={upcoming} />
          )}

          {topRated.length > 0 && (
            <MovieList title="Top Rated" data={topRated} />
          )}
        </ScrollView>
      )}
    </View>
  );
}
