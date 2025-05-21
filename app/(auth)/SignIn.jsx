import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { success, error } = await signIn(email, password);
      
      if (!success) {
        let errorMessage = 'Invalid email or password';
        if (error?.message) {
          errorMessage = error.message;
        }
        Alert.alert('Sign In Failed', errorMessage);
        return;
      }
      
      // Navigate to home on successful login
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Sign In Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-white"
      >
        <View className="flex-1 items-center pt-16 px-6">
          {/* Logo */}
          <Image 
            source={require('../../assets/images/logo.png')}
            className="w-36 h-36 rounded-2xl mb-8"
          />
          
          {/* Title */}
          <Text className="text-3xl font-bold mb-8 font-['winky-bold']">
            Welcome Back!
          </Text>
          
          {/* Email Input */}
          <View className="w-full mb-4">
            <View className={`flex-row items-center border rounded-lg px-4 py-3 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 ml-2 text-base font-['winky']"
              />
            </View>
            {formErrors.email && (
              <Text className="text-red-500 text-sm ml-1 mt-1 font-['winky']">
                {formErrors.email}
              </Text>
            )}
          </View>
          
          {/* Password Input */}
          <View className="w-full mb-6">
            <View className={`flex-row items-center border rounded-lg px-4 py-3 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 ml-2 text-base font-['winky']"
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {formErrors.password && (
              <Text className="text-red-500 text-sm ml-1 mt-1 font-['winky']">
                {formErrors.password}
              </Text>
            )}
          </View>
          
          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push('/ForgotPassword')}
            className="self-end mb-6"
          >
            <Text className="text-primary font-['winky'] text-sm">
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            className={`w-full py-4 rounded-lg items-center justify-center ${loading ? 'bg-primary/70' : 'bg-primary'}`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-lg font-['winky']">
                Sign In
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Sign Up Link */}
          <View className="flex-row items-center mt-6">
            <Text className="text-gray-600 font-['winky']">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/SignUp')}>
              <Text className="ml-1 text-primary font-['winky-bold']">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}