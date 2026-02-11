import { Router } from "express";
import Recommendation from "../models/Recommendation.js";
import { validateRecommendation } from "../middleware/validateRecommendation.js";
import { matchPlans } from "../services/matcher.js";

const router = Router();

router.post("/", validateRecommendation, async (req, res) => {
  try {
    const doc = await Recommendation.create(req.body);

    const recommendations = matchPlans(
      req.body.common_user_data,
      req.body.selected_category,
      req.body.category_data
    );

    doc.recommendations = recommendations;
    doc.status = "completed";
    await doc.save();

    res.status(201).json({ success: true, id: doc._id, recommendations });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:uid", async (req, res) => {
  try {
    const docs = await Recommendation.find({ firebase_uid: req.params.uid })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
