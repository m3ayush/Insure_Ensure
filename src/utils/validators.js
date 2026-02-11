export function validatePincode(val) {
  return /^\d{6}$/.test(val);
}

export function validateMobile(val) {
  return /^[6-9]\d{9}$/.test(val);
}

export function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

export function calculateAge(dob) {
  const [year, month, day] = dob.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }
  return age;
}

export function validateCommonData(data) {
  const errors = {};

  if (!data.full_name || data.full_name.trim().length < 2) {
    errors.full_name = "Name must be at least 2 characters";
  }
  if (!data.dob) {
    errors.dob = "Date of birth is required";
  } else {
    const age = calculateAge(data.dob);
    if (age < 18 || age > 100) {
      errors.dob = "Age must be between 18 and 100";
    }
  }
  if (!data.gender) {
    errors.gender = "Gender is required";
  }
  if (!validatePincode(data.pincode)) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }
  if (!validateMobile(data.mobile)) {
    errors.mobile = "Enter a valid 10-digit mobile number";
  }
  if (!validateEmail(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.annual_income || Number(data.annual_income) < 0) {
    errors.annual_income = "Annual income is required";
  }
  if (!data.employment_status) {
    errors.employment_status = "Employment status is required";
  }
  if (!data.marital_status) {
    errors.marital_status = "Marital status is required";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
