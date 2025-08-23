// ใช้ type ของ SupabaseClient และ User เพื่อความสอดคล้องกับ type เดิม

import { Logger } from '@/src/domain/interfaces/logger';
import type { AuthError as SupabaseAuthError, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import {
  AuthChangeEvent,
  AuthDataSource,
  AuthError,
  AuthErrorType,
  AuthResult,
  AuthUser
} from '../../domain/interfaces/datasources/auth-datasource';

/**
 * Supabase implementation of the AuthDataSource interface
 * This adapter pattern allows us to swap out Supabase with another auth provider if needed
 * Implements the Interface Segregation Principle by providing implementations for all required interfaces
 */
export class SupabaseAuthDataSource implements AuthDataSource {
  private client: SupabaseClient;

  constructor(
    private logger: Logger,
    client: SupabaseClient
  ) {
    if (!client) {
      throw new Error('Supabase client is required for SupabaseAuthDataSource');
    }
    this.client = client;
  }

  /**
   * Handles authentication errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation description
   * @param context Optional context information
   * @throws AuthError with appropriate error type
   */
  handleError(error: unknown, operation = 'auth operation', context = ''): never {
    this.logger.error(`Error during ${operation}: ${context}`, error);
    
    // Default error type and message
    let errorType = AuthErrorType.UNKNOWN_ERROR;
    let errorMessage = `Authentication error during ${operation}`;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle Supabase specific errors
      if ((error as SupabaseAuthError).status) {
        const supabaseError = error as SupabaseAuthError;
        const status = supabaseError.status;
        const message = supabaseError.message;
        
        if (message.includes('Invalid login credentials')) {
          errorType = AuthErrorType.INVALID_CREDENTIALS;
        } else if (message.includes('User already registered')) {
          errorType = AuthErrorType.EMAIL_IN_USE;
        } else if (message.includes('Password should be')) {
          errorType = AuthErrorType.WEAK_PASSWORD;
        } else if (message.includes('Invalid email')) {
          errorType = AuthErrorType.INVALID_EMAIL;
        } else if (message.includes('User not found')) {
          errorType = AuthErrorType.USER_NOT_FOUND;
        } else if (message.includes('Auth session missing') || message.includes('JWT expired')) {
          errorType = AuthErrorType.SESSION_EXPIRED;
        } else if (status === 429) {
          errorType = AuthErrorType.RATE_LIMIT_EXCEEDED;
        } else if (status === 403) {
          errorType = AuthErrorType.PERMISSION_DENIED;
        } else if (message.includes('Email not confirmed')) {
          errorType = AuthErrorType.EMAIL_NOT_VERIFIED;
        } else if (message.includes('Invalid MFA')) {
          errorType = AuthErrorType.INVALID_MFA_CODE;
        }
      } else if (error.name === 'NetworkError' || error.message.includes('network')) {
        errorType = AuthErrorType.NETWORK_ERROR;
      }
    }
    
    throw new AuthError(errorType, errorMessage, error);
  }
  
  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.handleError(error, 'signInWithPassword', `email: ${email}`);
      }

      if (!data.user) {
        this.handleError(new Error('No user returned after successful login'), 'signInWithPassword');
      }

      return this.mapAuthUser(data.user);
    } catch (error) {
      this.handleError(error, 'signInWithPassword', `email: ${email}`);
    }
  }

  async signUp(email: string, password: string, metadata?: Record<string, unknown>): Promise<AuthResult> {
    try {
      this.logger.info('Signing up user with metadata:', { email, hasMetadata: !!metadata });
      
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });

      if (error) {
        this.handleError(error, 'signUp', `email: ${email}`);
      }

      if (!data.user) {
        this.handleError(new Error('No user returned after successful signup'), 'signUp');
      }
      
      // Log success with metadata information
      this.logger.info('User signed up successfully with metadata', { 
        userId: data.user.id,
        metadata: data.user.user_metadata 
      });

      return this.mapAuthUser(data.user);
    } catch (error) {
      this.handleError(error, 'signUp', `email: ${email}`);
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await this.client.auth.signOut();
      
      if (error) {
        this.handleError(error, 'signOut');
      }
    } catch (error) {
      this.handleError(error, 'signOut');
    }
  }

  async getSession(): Promise<AuthUser | null> {
    try {
      const { data, error } = await this.client.auth.getSession();
      
      if (error) {
        // Special case for session errors - we don't want to throw for missing sessions
        if (error.message && error.message.includes('Auth session missing')) {
          return null;
        }
        this.handleError(error, 'getSession');
      }

      if (!data.session?.user) {
        return null;
      }

      return this.mapAuthUser(data.session.user);
    } catch (error) {
      // Special case for session errors - we don't want to throw for missing sessions
      if (error instanceof Error && error.message && error.message.includes('Auth session missing')) {
        return null;
      }
      this.handleError(error, 'getSession');
    }
  }

  async getUser(): Promise<AuthUser | null> {
    try {
      const { data, error } = await this.client.auth.getUser();
      
      if (error) {
        // Special case for session errors - we don't want to throw for missing sessions
        if (error.message && error.message.includes('Auth session missing')) {
          return null;
        }
        this.handleError(error, 'getUser');
      }

      if (!data.user) {
        return null;
      }

      return this.mapAuthUser(data.user);
    } catch (error) {
      // Special case for session errors - we don't want to throw for missing sessions
      if (error instanceof Error && error.message && error.message.includes('Auth session missing')) {
        return null;
      }
      this.handleError(error, 'getUser');
    }
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, user: AuthUser | null) => void): { unsubscribe: () => void } {
    const { data } = this.client.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? this.mapAuthUser(session.user) : null;
      callback(event, user);
    });

    return {
      unsubscribe: () => {
        data.subscription.unsubscribe();
      }
    };
  }

  private mapAuthUser(supabaseUser: SupabaseUser): AuthUser {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      createdAt: supabaseUser.created_at || '',
      updatedAt: supabaseUser.updated_at || '',
      emailConfirmedAt: supabaseUser.email_confirmed_at || '',
      phone: supabaseUser.phone || '',
      lastSignInAt: supabaseUser.last_sign_in_at || '',
      userMetadata: supabaseUser.user_metadata || {},
      appMetadata: supabaseUser.app_metadata || {},
      role: supabaseUser.role || '',
    };
  }
}
