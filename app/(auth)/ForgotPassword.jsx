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

export default function ForgotPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formError, setFormError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Email is invalid');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { success, error } = await resetPassword(email);
      
      if (!success) {
        let errorMessage = 'Failed to send reset email';
        if (error?.message) {
          errorMessage = error.message;
        }
        Alert.alert('Reset Failed', errorMessage);
        return;
      }
      
      setEmailSent(true);
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Reset Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="mail-outline" size={80} color="#0075ff" />
        
        <Text className="text-2xl font-bold mt-6 mb-4 text-center font-['winky-bold']">
          Check Your Email
        </Text>
        
        <Text className="text-gray-600 text-center mb-8 font-['winky']">
          We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
        </Text>
        
        <TouchableOpacity
          onPress={() => router.replace('/SignIn')}
          className="w-full py-4 bg-primary rounded-lg items-center justify-center"
        >
          <Text className="text-white text-lg font-['winky']">
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="self-start mb-6"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          {/* Logo */}
          <Image 
            source={require('../../assets/images/logo.png')}
            className="w-32 h-32 rounded-2xl mb-6"
          />
          
          {/* Title */}
          <Text className="text-2xl font-bold mb-2 font-['winky-bold']">
            Forgot Password
          </Text>
          
          {/* Subtitle */}
          <Text className="text-gray-600 text-center mb-8 font-['winky']">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          {/* Email Input */}
          <View className="w-full mb-6">
            <View className={`flex-row items-center border rounded-lg px-4 py-3 ${formError ? 'border-red-500' : 'border-gray-300'}`}>
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
            {formError ? (
              <Text className="text-red-500 text-sm ml-1 mt-1 font-['winky']">
                {formError}
              </Text>
            ) : null}
          </View>
          
          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={loading}
            className={`w-full py-4 rounded-lg items-center justify-center ${loading ? 'bg-primary/70' : 'bg-primary'}`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-lg font-['winky']">
                Reset Password
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Sign In Link */}
          <TouchableOpacity 
            onPress={() => router.replace('/SignIn')}
            className="mt-6"
          >
            <Text className="text-primary font-['winky']">
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}