import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    phone: true,
  },
  multifactor: {
    mode: 'REQUIRED',
    sms: true,
  },
  accountRecovery: "PHONE_ONLY_WITHOUT_MFA", // Adjusted to be compatible with SMS MFA
});
