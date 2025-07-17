import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.api.baseUrl;
  private endpoints = environment.api.endpoints;

  constructor(private http: HttpClient) { }

  /**
   * Get the full URL for an endpoint
   */
  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Get default headers
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<any> {
    const url = this.getUrl(this.endpoints.login);
    const body = { email, password };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }

  /**
   * Check if user exists
   */
  checkUser(email: string): Observable<any> {
    const url = this.getUrl(this.endpoints.checkUser);
    const body = { emailId: email };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }

  /**
   * Check if user exists (GET method fallback)
   */
  checkUserGet(email: string): Observable<any> {
    const url = `${this.getUrl(this.endpoints.checkUser)}?emailId=${encodeURIComponent(email)}`;
    return this.http.get(url);
  }

  /**
   * Send OTP
   */
  sendOtp(email: string, action: string = 'signup'): Observable<any> {
    const url = `${this.getUrl(this.endpoints.sendOtp)}?id=${encodeURIComponent(email)}&action=${action}`;
    return this.http.post(url, {}, { headers: this.getHeaders() });
  }

  /**
   * Verify OTP
   */
  verifyOtp(email: string, otp: string): Observable<any> {
    const url = this.getUrl(this.endpoints.verifyOtp);
    const body = { email, otp };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }

  /**
   * Google authentication (if needed for backend)
   */
  googleAuth(token: string): Observable<any> {
    const url = this.getUrl(this.endpoints.googleAuth);
    const body = { token };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }

  /**
   * Therapist login with email and password
   */
  therapistLogin(email: string, password: string): Observable<any> {
    const url = this.getUrl(this.endpoints.therapistLogin);
    const body = { email, password };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }

  /**
   * Therapist Google Signin (GET for login, POST for signup/OTP)
   */
  therapistGoogleSignin(emailId: string, data?: any): Observable<any> {
    const url = `${this.getUrl(this.endpoints.therapistGoogleSignin)}?emailId=${encodeURIComponent(emailId)}`;
    if (data) {
      return this.http.post(url, data, { headers: this.getHeaders() });
    } else {
      return this.http.get(url, { headers: this.getHeaders() });
    }
  }

  /**
   * Therapist signup (POST to google-signin endpoint)
   */
  therapistSignup(data: any): Observable<any> {
    return this.therapistGoogleSignin(data.emailId, data);
  }

  /**
   * Therapist signup with OTP verification
   */
  therapistSignupWithOtp(data: any, otp: string): Observable<any> {
    const url = `${this.getUrl(this.endpoints.therapistSignup)}?otp=${encodeURIComponent(otp)}`;
    return this.http.post(url, data, { headers: this.getHeaders() });
  }

  /**
   * Therapist send OTP (POST to google-signin endpoint)
   */
  therapistSendOtp(data: any): Observable<any> {
    return this.therapistGoogleSignin(data.emailId, data);
  }

  /**
   * Fetch user profile with token
   */
  fetchUserProfile(token: string): Observable<any> {
    const url = this.getUrl(this.endpoints.fetchUserProfile);
    const headers = this.getHeaders().set('Authorization', `Bearer ${token}`);
    console.log('🔍 Fetching user profile...');
    console.log('📍 URL:', url);
    console.log('🔑 Token:', token);
    return this.http.get(url, { headers });
  }

  /**
   * Update user profile with token
   */
  updateUserProfile(token: string, profileData: any): Observable<any> {
    const url = this.getUrl(this.endpoints.updateUserProfile);
    const headers = this.getHeaders().set('Authorization', `Bearer ${token}`);
    console.log('📝 Updating user profile...');
    console.log('📍 URL:', url);
    console.log('🔑 Token:', token);
    console.log('📦 Data:', profileData);
    return this.http.put(url, profileData, { headers });
  }

  /**
   * Fetch patient details with token
   */
  fetchPatientDetails(token: string): Observable<any> {
    const url = this.getUrl(this.endpoints.fetchPatientDetails);
    const headers = this.getHeaders().set('Authorization', `Bearer ${token}`);
    console.log('🔍 Fetching patient details...');
    console.log('📍 URL:', url);
    console.log('🔑 Token:', token);
    return this.http.get(url, { headers });
  }

  /**
   * Get current API configuration for debugging
   */
  getApiConfig() {
    return {
      baseUrl: this.baseUrl,
      endpoints: this.endpoints,
      environment: environment.production ? 'production' : 'development'
    };
  }
} 