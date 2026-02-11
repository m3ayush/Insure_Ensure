export function validateRecommendation(req, res, next) {
  const { firebase_uid, common_user_data, selected_category, category_data } =
    req.body;

  const errors = [];

  if (!firebase_uid) errors.push("firebase_uid is required");
  if (!common_user_data) errors.push("common_user_data is required");
  if (!selected_category) errors.push("selected_category is required");
  if (!category_data || Object.keys(category_data).length === 0)
    errors.push("category_data is required");

  if (common_user_data) {
    if (!common_user_data.full_name) errors.push("full_name is required");
    if (!common_user_data.dob) errors.push("dob is required");
    if (!common_user_data.gender) errors.push("gender is required");
    if (!/^\d{6}$/.test(common_user_data.pincode))
      errors.push("Invalid pincode");
    if (!/^[6-9]\d{9}$/.test(common_user_data.mobile))
      errors.push("Invalid mobile");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }
  next();
}
