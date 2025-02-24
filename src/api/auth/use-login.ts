import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
  password: string;
  expiresInMins?: number;
};

type Response = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

const login = async (variables: Variables): Promise<Response> => {
  try {
    const { data } = await client({
      url: '/v1/users/sign_in',
      method: 'POST',
      data: {
        user: variables,
      },
    });
    if(data.error) {
      console.error('DATA Error en la petición de login:', data.error);
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error en la petición de login:', error);
    throw error;
  }
};

export const useLogin = createMutation<Response, Variables>({
  mutationFn: (variables) => login(variables),
});
