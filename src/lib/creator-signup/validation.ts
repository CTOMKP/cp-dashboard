export type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  accountType: string;
  mainAudience: string;
  country: string;
  language: string;
  telegramUsername: string;
  referralCode: string;
  agreeToTerms: boolean;
};

export type SignupFieldErrors = Partial<Record<keyof SignupFormValues, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export function validateSignupForm(values: SignupFormValues): SignupFieldErrors {
  const errors: SignupFieldErrors = {};

  if (!values.firstName.trim()) errors.firstName = "First name is required";
  if (!values.lastName.trim()) errors.lastName = "Last name is required";

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!values.username.trim()) {
    errors.username = "Username is required";
  } else if (!USERNAME_REGEX.test(values.username.trim())) {
    errors.username = "Only letters, numbers, and underscores";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!values.accountType) errors.accountType = "Select how you will promote";
  if (!values.mainAudience) errors.mainAudience = "Select your main audience";
  if (!values.country) errors.country = "Country is required";
  if (!values.language) errors.language = "Language is required";
  if (!values.agreeToTerms) errors.agreeToTerms = "You must accept the terms";

  return errors;
}

export function isSignupFormComplete(values: SignupFormValues): boolean {
  return (
    values.firstName.trim() !== "" &&
    values.lastName.trim() !== "" &&
    values.email.trim() !== "" &&
    values.username.trim() !== "" &&
    USERNAME_REGEX.test(values.username.trim()) &&
    values.password.length >= 8 &&
    values.confirmPassword === values.password &&
    EMAIL_REGEX.test(values.email.trim()) &&
    values.accountType !== "" &&
    values.mainAudience !== "" &&
    values.country !== "" &&
    values.language !== "" &&
    values.agreeToTerms
  );
}
