import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function AuthRoutesLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        return <Redirect href={"/"} />;
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
        </>
    );
}
