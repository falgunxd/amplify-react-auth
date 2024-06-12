import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    phone: true,
  },
  multifactor: {
    mode: 'REQUIRED',
    sms: true
  },
  accountRecovery: "PHONE_WITHOUT_MFA_AND_EMAIL"
});
