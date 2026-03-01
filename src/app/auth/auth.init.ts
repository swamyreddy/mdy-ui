import { AuthService } from './auth.service';

export function authInitializer(authService: AuthService) {
  return () => authService.autoLogin();
}
