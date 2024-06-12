import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    phone: true,
  },
  multifactor: {
    mode: 'REQUIRED',
    sms: true,
  },
  accountRecovery: "NONE", 
});
