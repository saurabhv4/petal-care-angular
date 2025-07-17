export const environment = {
    production: false,
    api: {
      baseUrl: 'http://3.7.210.24:9001',
      endpoints: {
        login: '/api/v1/auth/login',
        googleAuth: '/api/v1/auth/google',
        checkUser: '/api/v1/auth/chk-usr',
        sendOtp: '/api/v1/auth/send-otp',
        verifyOtp: '/api/v1/auth/verify-otp',
        fetchUserProfile: '/api/v1/profile/fetch-user',
        updateUserProfile: '/api/v1/profile/update-details',
        fetchPatientDetails: '/api/v1/profile/fetch-patients',
        therapistLogin: '/api/v1/therapist/login',
        therapistSignup: '/api/v1/therapist/signup',
        therapistGoogleSignin: '/api/v1/therapist/google-signin'
      }
    },
    firebase: {
      // TODO: Replace with your actual Firebase API key from Firebase Console
      // Go to Firebase Console -> Project Settings -> General -> Your apps -> Web app
      apiKey: "AIzaSyDx8qjAK85O-zRsu3kak2JYo5HMXayAujo",
      authDomain: "petalcare02202024.firebaseapp.com",
      projectId: "petalcare02202024",
      storageBucket: "petalcare02202024.appspot.com",
      messagingSenderId: "972714769743",
      appId: "1:972714769743:web:cad16815dfe8a0856e193a",
      measurementId: "G-YX485ZCGLD"
    }
  };
  