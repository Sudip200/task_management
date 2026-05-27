import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api';

export default function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => loginUser(data),
  });
}