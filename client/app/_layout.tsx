import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishListContext";
import "@/global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ClerkProvider
                publishableKey={publishableKey}
                tokenCache={tokenCache}
            >
                <CartProvider>
                    <WishlistProvider>
                        <Stack screenOptions={{ headerShown: false }} />
                        <Toast />
                    </WishlistProvider>
                </CartProvider>
            </ClerkProvider>
        </GestureHandlerRootView>
    );
}
