"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedbackController_1 = require("../controllers/FeedbackController");
const router = (0, express_1.Router)();
const controller = new FeedbackController_1.FeedbackController();
router.get('/', controller.getAll);
router.post('/', controller.create);
exports.default = router;
