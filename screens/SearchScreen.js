import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";
import { debounce } from "lodash";
import Loading from "../components/loading";

const { width, height } = Dimensions.get("window");

export default function SearchScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = (search) => {
    if (search && search.length > 2) {
      setLoading(true);
      searchMovies({
        query: search,
        include_adult: false,
        language: "en-US",
        page: "1",
      }).then((data) => {
        console.log("got search results");
        setLoading(false);
        if (data && data.results) setResults(data.results);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111111" }}>
      {/* Search input */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#888888",
            borderRadius: 20,
            paddingHorizontal: 12,
          }}
        >
          <TextInput
            onChangeText={handleTextDebounce}
            placeholder="Search Movie"
            placeholderTextColor={"#888888"}
            style={{
              flex: 1,
              color: "#ffffff",
              fontSize: 16,
              fontWeight: "bold",
              paddingVertical: 10,
            }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={{
              borderRadius: 20,
              padding: 10,
              backgroundColor: "#888888",
              marginLeft: 10,
            }}
          >
            <XMarkIcon size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search results */}
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          style={{ paddingHorizontal: 16, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Results ({results.length})
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {results.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View style={{ marginBottom: 20 }}>
                    <Image
                      source={{
                        uri: image185(item.poster_path) || fallbackMoviePoster,
                      }}
                      style={{
                        borderRadius: 12,
                        width: width * 0.45,
                        height: height * 0.3,
                      }}
                    />
                    <Text
                      style={{ color: "#ffffff", marginTop: 8, fontSize: 16 }}
                    >
                      {item.title.length > 22
                        ? `${item.title.slice(0, 22)}...`
                        : item.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("../assets/images/movieTime.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
