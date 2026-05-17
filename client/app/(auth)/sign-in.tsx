import { useSignIn } from "@clerk/expo";
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
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Page() {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");

    const handleSubmit = async () => {
        const { error } = await signIn.password({
            emailAddress,
            password,
        });
        if (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.errors?.[0]?.longMessage || error.message || "An error occurred",
            });
            return;
        }

        if (signIn.status === "complete") {
            await signIn.finalize({
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
        } else if (signIn.status === "needs_second_factor") {
            // multi-factor authentication
        } else if (signIn.status === "needs_client_trust") {
            const emailCodeFactor = signIn.supportedSecondFactors.find(
                (factor) => factor.strategy === "email_code",
            );

            if (emailCodeFactor) {
                await signIn.mfa.sendEmailCode();
            }
        } else {
            console.error("Sign-in attempt not complete:", signIn);
        }
    };

    const handleVerify = async () => {
        await signIn.mfa.verifyEmailCode({ code });

        if (signIn.status === "complete") {
            await signIn.finalize({
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
            console.error("Sign-in attempt not complete:", signIn);
        }
    };

    if (signIn.status === "needs_client_trust") {
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
                    onPress={() => signIn.mfa.sendEmailCode()}
                >
                    <Text className="text-black font-semibold">
                        I need a new code
                    </Text>
                </Pressable>

                <Pressable
                    className="py-4 rounded-full items-center mt-2 active:opacity-70"
                    onPress={() => signIn.reset()}
                >
                    <Text className="text-black font-semibold">Start over</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 p-6"
                showsVerticalScrollIndicator={false}
            >
                <Pressable onPress={() => router.back()} className="mb-2">
                    <Ionicons name="arrow-back" size={28} color="black" />
                </Pressable>

                <Text className="text-3xl font-bold text-center mt-2">
                    Welcome Back
                </Text>
                <Text className="text-gray-500 text-center mt-2 mb-8">
                    Sign in to continue
                </Text>

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
                        Sign In
                    </Text>
                </Pressable>



                <View className="flex-row justify-center mt-8 mb-12">
                    <Text className="text-gray-500">
                        Don't have an account?{" "}
                    </Text>
                    <Link href="/(auth)/sign-up">
                        <Text className="text-black font-bold">Sign up</Text>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
