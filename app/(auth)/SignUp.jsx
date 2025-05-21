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

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Full name is required';
    }
    
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
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { success, error, data } = await signUp(email, password, { name });
      
      if (!success) {
        let errorMessage = 'Failed to create account';
        if (error?.message) {
          errorMessage = error.message;
        }
        Alert.alert('Sign Up Failed', errorMessage);
        return;
      }
      
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        Alert.alert(
          'Email Verification Required',
          'We\'ve sent you an email to verify your account. Please check your inbox and follow the instructions.',
          [{ text: 'OK', onPress: () => router.replace('/SignIn') }]
        );
      } else {
        // Navigate to home on successful signup
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', 'An unexpected error occurred. Please try again.');
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
        <View className="flex-1 items-center pt-12 px-6">
          {/* Logo */}
          <Image 
            source={require('../../assets/images/logo.png')}
            className="w-32 h-32 rounded-2xl mb-6"
          />
          
          {/* Title */}
          <Text className="text-2xl font-bold mb-6 font-['winky-bold']">
            Create New Account
          </Text>
          
          {/* Name Input */}
          <View className="w-full mb-4">
            <View className={`flex-row items-center border rounded-lg px-4 py-3 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCorrect={false}
                className="flex-1 ml-2 text-base font-['winky']"
              />
            </View>
            {formErrors.name && (
              <Text className="text-red-500 text-sm ml-1 mt-1 font-['winky']">
                {formErrors.name}
              </Text>
            )}
          </View>
          
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
          <View className="w-full mb-4">
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
          
          {/* Confirm Password Input */}
          <View className="w-full mb-6">
            <View className={`flex-row items-center border rounded-lg px-4 py-3 ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 ml-2 text-base font-['winky']"
              />
            </View>
            {formErrors.confirmPassword && (
              <Text className="text-red-500 text-sm ml-1 mt-1 font-['winky']">
                {formErrors.confirmPassword}
              </Text>
            )}
          </View>
          
          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            className={`w-full py-4 rounded-lg items-center justify-center ${loading ? 'bg-primary/70' : 'bg-primary'}`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-lg font-['winky']">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Sign In Link */}
          <View className="flex-row items-center mt-6">
            <Text className="text-gray-600 font-['winky']">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/SignIn')}>
              <Text className="ml-1 text-primary font-['winky-bold']">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}