const express = require("express");
const upload = require("../middleware/multer");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  markTaskAsDone,
} = require("../controllers/task.controller");

const router = express.Router();

router.post(
    "/",
    upload.single("linkedFile"),
    createTask
);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.delete("/:id", deleteTaskById);
router.patch("/:id/status", markTaskAsDone);
router.put(
    "/:id",
    upload.single("linkedFile"),
    updateTaskById
);

module.exports = router;