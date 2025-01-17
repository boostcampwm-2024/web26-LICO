import { api } from './axios';
import { AuthResponse, RefreshTokenResponse, AuthCallbackParams } from '@/types/auth';

export const authApi = {
  async logout() {
    const response = await api.get('/auth/logout');
    return response.data;
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh');
    return response.data;
  },

  async handleCallback(params: AuthCallbackParams): Promise<AuthResponse> {
    const { provider, code, state } = params;
    const response = await api.get<AuthResponse>(`/auth/${provider}/callback`, {
      params: { code, state },
    });
    return response.data;
  },

  async guestLogin(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/auth/lico/guest');
    return response.data;
  },
};
