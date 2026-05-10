import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWishlist } from "@/context/WishListContext";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

export default function Favorites() {
    const { wishlist } = useWishlist();
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
            <Header title="Wishlist" showMenu showCart />

            {wishlist.length > 0 ? (
                <ScrollView
                    className="flex-1 px-4 mt-4"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-row flex-wrap justify-between">
                        {wishlist.map((item, index) => (
                            <ProductCard key={index} product={item} />
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-secondary text-lg">
                        Your Wishlist is empty
                    </Text>
                    <TouchableOpacity
                        className="bg-primary mt-4 px-6 py-2 rounded-full"
                        onPress={() => router.push("/")}
                    >
                        <Text className="text-white font-bold">
                            Start Shopping
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
