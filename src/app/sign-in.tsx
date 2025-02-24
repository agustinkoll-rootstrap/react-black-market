import { useRouter } from 'expo-router';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { useLogin } from '@/api/auth/use-login';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/ui';

export default function Login() {
  const router = useRouter();

  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      router.push('/');
    },
    onError: (error) => showMessage({ message: error.message, type: 'danger' }),
  });

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    login(data);
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} isLoading={isPending} />
    </>
  );
}
