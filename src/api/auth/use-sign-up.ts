import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
};

type Response = {
  status: string;
  data: {
    id: string;
    email: string;
    name: string;
    provider: string;
    uid: string;
    allowPasswordChange: boolean;
    createdAt: string;
    updatedAt: string;
    nickname?: string;
    image?: string;
    birthday?: string;
  };
};

const signUp = async (variables: Variables) => {
  try {
     const { data } = await client({
      url: '/v1/users',
      method: 'POST',
      data: {
        user: variables,
      },
    });
    
    if(data.error) {
      console.error('DATA Error en la petición de SIGN UP:', data.error);
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error in signUp request:', error);
    throw error;
  }
};

export const useSignUp = createMutation<Response, Variables>({
  mutationFn: (variables) => signUp(variables),
});
