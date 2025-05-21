import { supabase } from '../config/supabaseConfig';

// ============ User Management ============
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
};

export const enrollUserInCertification = async (userId, certificationId) => {
  try {
    // First get the current enrolled certifications
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('enrolled_certifications')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Check if already enrolled
    const enrolledCertifications = profileData.enrolled_certifications || [];
    if (enrolledCertifications.includes(certificationId)) {
      return { data: profileData, error: null, alreadyEnrolled: true };
    }
    
    // Add the certification ID to the array
    const updatedEnrollments = [...enrolledCertifications, certificationId];
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ enrolled_certifications: updatedEnrollments })
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    return { data, error: null, alreadyEnrolled: false };
  } catch (error) {
    console.error('Error enrolling in certification:', error);
    return { data: null, error, alreadyEnrolled: false };
  }
};

// ============ Certification Management ============
export const getAllCertifications = async () => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return { data: null, error };
  }
};

export const getCertificationById = async (certId) => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', certId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching certification (${certId}):`, error);
    return { data: null, error };
  }
};

export const createCertification = async (certificationData) => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .insert([
        {
          title: certificationData.title,
          description: certificationData.description,
          image_url: certificationData.image || null,
        },
      ])
      .select();
      
    if (error) {
      throw error;
    }
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating certification:', error);
    return { data: null, error };
  }
};

// ============ Module Management ============
export const getModulesByIds = async (moduleIds) => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .in('id', moduleIds);
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching modules by ids:', error);
    return { data: null, error };
  }
};

export const getModulesByCertificationId = async (certId) => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('certification_id', certId)
      .order('module_number', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching modules for certification (${certId}):`, error);
    return { data: null, error };
  }
};

export const createModule = async (moduleData) => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .insert([
        {
          certification_id: moduleData.certificationId,
          title: moduleData.title,
          description: moduleData.description,
          module_number: moduleData.moduleNumber,
        },
      ])
      .select();
      
    if (error) {
      throw error;
    }
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating module:', error);
    return { data: null, error };
  }
};

// ============ Question Management ============
export const getQuestionsByModuleId = async (moduleId) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('module_id', moduleId);
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching questions for module (${moduleId}):`, error);
    return { data: null, error };
  }
};

export const createQuestion = async (questionData) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          module_id: questionData.moduleId,
          certification_id: questionData.certificationId,
          text: questionData.text,
          options: questionData.options,
          explanation: questionData.explanation,
        },
      ])
      .select();
      
    if (error) {
      throw error;
    }
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating question:', error);
    return { data: null, error };
  }
};

// ============ Test Results Management ============
export const saveTestResult = async (resultData) => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert([
        {
          user_id: resultData.userId,
          module_id: resultData.moduleId,
          module_title: resultData.moduleTitle,
          questions_count: resultData.questionsCount,
          correct_answers: resultData.correctAnswers,
          incorrect_answers: resultData.incorrectAnswers,
          skipped_answers: resultData.skippedAnswers,
          score: resultData.score,
          time_taken: resultData.timeTaken,
          user_answers: resultData.userAnswers,
          question_reports: resultData.questionReports,
          device_info: resultData.deviceInfo,
        },
      ])
      .select();
      
    if (error) {
      throw error;
    }
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error saving test result:', error);
    return { data: null, error };
  }
};

export const getTestResultsByUserId = async (userId, limit = 10, startAfter = null) => {
  try {
    let query = supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);
      
    if (startAfter) {
      query = query.lt('completed_at', startAfter);
    }
    
    const { data, error } = await query;
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching test results for user (${userId}):`, error);
    return { data: null, error };
  }
};

export const markTestResultAsViewed = async (resultId) => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .update({ has_been_viewed: true })
      .eq('id', resultId);
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error marking test result as viewed (${resultId}):`, error);
    return { data: null, error };
  }
};

export const deleteTestResult = async (resultId) => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .delete()
      .eq('id', resultId);
      
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting test result (${resultId}):`, error);
    return { success: false, error };
  }
};

export const clearAllTestResults = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error clearing all test results for user (${userId}):`, error);
    return { success: false, error };
  }
};