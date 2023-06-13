'use client';

import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/base/inputs/Input';
import { Button } from '@/components/base/Button';
import { AuthSocialButton } from '@/app/(site)/components/AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { signIn, useSession } from 'next-auth/react';
import { AuthSocialStrategy } from '@/app/api/auth/[...nextauth]/route';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register';

interface LoginDto {
  name: string;
  email: string;
  password: string;
}

export const AuthForm = () => {
  const session = useSession();
  const router = useRouter();

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const toggleMode = useCallback(
    () => setAuthMode(prev => (prev == 'login' ? 'register' : 'login')),
    [authMode]
  );

  const submitHandler: SubmitHandler<LoginDto> = data => {
    setIsLoading(true);

    if (authMode == 'register') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', { ...data, redirect: false }))
        .catch(() => toast.error('Something went wrong...'))
        .finally(() => setIsLoading(false));
    } else {
      signIn('credentials', { ...data, redirect: false })
        .then(cb => {
          if (cb?.error) return toast.error('Invalid credentials');
          if (cb?.ok) {
            router.push('/users');
            toast.success('Logged in!');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = useCallback(
    (action: AuthSocialStrategy) => {
      setIsLoading(true);
      signIn(action)
        .then(cb => {
          if (!cb) return;
          if (cb?.ok && !cb.error) {
            toast.success('Logged in!');
            router.push('/users');
          } else toast.error('Something went wrong...');
        })
        .finally(() => setIsLoading(false));
    },
    [isLoading]
  );

  const handleAuthWithGoogle = useCallback(() => socialAction('google'), []);
  const handleAuthWithGithub = useCallback(() => socialAction('github'), []);

  useEffect(() => {
    session?.status == 'authenticated' && router.push('/users');
  }, [session?.status]);

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
          {authMode == 'register' && (
            <Input<LoginDto>
              id="name"
              label="Name"
              register={register}
              disabled={isLoading}
              errors={errors}
            />
          )}
          <Input<LoginDto>
            id="email"
            label="Email"
            type="email"
            register={register}
            disabled={isLoading}
            errors={errors}
          />
          <Input<LoginDto>
            id="password"
            label="Password"
            type="password"
            register={register}
            disabled={isLoading}
            errors={errors}
          />
          <div>
            <Button disabled={isLoading} type="submit" fullWidth>
              {authMode == 'login' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton icon={BsGithub} onClick={handleAuthWithGithub} />
            <AuthSocialButton icon={BsGoogle} onClick={handleAuthWithGoogle} />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {authMode == 'login'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleMode} className="underline cursor-pointer">
            {authMode == 'login' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};
