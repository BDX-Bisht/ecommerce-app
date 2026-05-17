import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
    Pressable,
    Text,
    TextInput,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
export default function Page() {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");

    const handleSubmit = async () => {
        const { error } = await signUp.password({
            emailAddress,
            password,
            firstName,
            lastName,
        });
        if (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2:
                    error.errors?.[0]?.longMessage ||
                    error.message ||
                    "An error occurred",
            });
            return;
        }

        if (!error) await signUp.verifications.sendEmailCode();
    };

    const handleVerify = async () => {
        await signUp.verifications.verifyEmailCode({
            code,
        });
        if (signUp.status === "complete") {
            await signUp.finalize({
                // Redirect the user to the home page after signing up
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }

                    const url = decorateUrl("/");
                    if (url.startsWith("http")) {
                        window.location.href = url;
                    } else {
                        router.push(url as Href);
                    }
                },
            });
        } else {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Verification failed. Please try again.",
            });
            console.error("Sign-up attempt not complete:", signUp);
        }
    };

    if (signUp.status === "complete" || isSignedIn) {
        return null;
    }

    if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address") &&
        signUp.missingFields.length === 0
    ) {
        return (
            <View className="flex-1 p-6 bg-white pt-12">
                <Pressable onPress={() => router.back()} className="mb-6">
                    <Ionicons name="arrow-back" size={28} color="black" />
                </Pressable>

                <Text className="text-3xl font-bold text-center mt-4">
                    Verify Account
                </Text>
                <Text className="text-gray-500 text-center mt-2 mb-8">
                    Enter the code sent to your email
                </Text>

                <Text className="font-semibold text-sm mb-2 text-black">
                    Verification Code
                </Text>
                <TextInput
                    className="bg-[#f8f8f8] rounded-2xl p-4 text-base mb-4"
                    value={code}
                    placeholder="Enter your verification code"
                    placeholderTextColor="#a1a1aa"
                    onChangeText={(code) => setCode(code)}
                    keyboardType="numeric"
                />

                <Pressable
                    className={`py-4 rounded-full items-center mt-4 active:opacity-70 ${
                        fetchStatus === "fetching" ? "bg-[#d4d4d8]" : "bg-black"
                    }`}
                    onPress={handleVerify}
                    disabled={fetchStatus === "fetching"}
                >
                    <Text className="text-white font-bold text-lg">Verify</Text>
                </Pressable>

                <Pressable
                    className="py-4 rounded-full items-center mt-2 active:opacity-70"
                    onPress={() => signUp.verifications.sendEmailCode()}
                >
                    <Text className="text-black font-semibold">
                        I need a new code
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <ScrollView
                className="flex-1 px-6 pt-12"
                showsVerticalScrollIndicator={false}
            >
                <Pressable onPress={() => router.back()} className="mb-2">
                    <Ionicons name="arrow-back" size={28} color="black" />
                </Pressable>

                <Text className="text-3xl font-bold text-center mt-2">
                    Create Account
                </Text>
                <Text className="text-gray-500 text-center mt-2 mb-8">
                    Sign up to get started
                </Text>

                <Text className="font-bold text-sm mb-2 text-black">
                    First Name
                </Text>
                <TextInput
                    className="bg-[#f8f8f8] rounded-2xl p-4 text-base mb-4"
                    value={firstName}
                    placeholder="John"
                    placeholderTextColor="#a1a1aa"
                    onChangeText={setFirstName}
                />

                <Text className="font-bold text-sm mb-2 text-black">
                    Last Name
                </Text>
                <TextInput
                    className="bg-[#f8f8f8] rounded-2xl p-4 text-base mb-4"
                    value={lastName}
                    placeholder="Doe"
                    placeholderTextColor="#a1a1aa"
                    onChangeText={setLastName}
                />

                <Text className="font-bold text-sm mb-2 text-black">Email</Text>
                <TextInput
                    className="bg-[#f8f8f8] rounded-2xl p-4 text-base mb-4"
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="user@example.com"
                    placeholderTextColor="#a1a1aa"
                    onChangeText={setEmailAddress}
                    keyboardType="email-address"
                />

                <Text className="font-bold text-sm mb-2 text-black">
                    Password
                </Text>
                <TextInput
                    className="bg-[#f8f8f8] rounded-2xl p-4 text-base mb-4"
                    value={password}
                    placeholder="********"
                    placeholderTextColor="#a1a1aa"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                />

                <Pressable
                    className={`py-4 rounded-full items-center mt-4 active:opacity-70 ${
                        !emailAddress || !password || fetchStatus === "fetching"
                            ? "bg-[#d4d4d8]"
                            : "bg-black"
                    }`}
                    onPress={handleSubmit}
                    disabled={
                        !emailAddress || !password || fetchStatus === "fetching"
                    }
                >
                    <Text className="text-white font-bold text-lg">
                        Continue
                    </Text>
                </Pressable>

                <View className="flex-row justify-center mt-8 mb-12">
                    <Text className="text-gray-500">
                        Already have an account?{" "}
                    </Text>
                    <Link href="/sign-in">
                        <Text className="text-black font-bold">Login</Text>
                    </Link>
                </View>

                <View nativeID="clerk-captcha" />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
