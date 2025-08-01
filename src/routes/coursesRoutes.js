const express = require("express");
const router = express.Router();
const controller = require("../controllers/coursesController");
const upload = require("../middleware/upload");

router.post("/creates",   upload.fields([
    { name: 'courseThumbnail', maxCount: 1 },
    { name: 'classThumbnail0', maxCount: 1 },
    { name: 'classThumbnail1', maxCount: 1 },
    { name: 'classThumbnail2', maxCount: 1 },
    { name: 'classThumbnail3', maxCount: 1 },
    { name: 'classThumbnail4', maxCount: 1 },
    { name: 'classThumbnail5', maxCount: 1 },
    { name: 'classThumbnail6', maxCount: 1 },
    { name: 'classThumbnail7', maxCount: 1 },
    { name: 'classThumbnail8', maxCount: 1 },
  ]),
controller.createCourse);

router.get("/all/:id", controller.getCourse);
router.get("/all", controller.getAllCourses);
router.put("/edit/:id", controller.updateCourse);
router.delete("/delete/:id", controller.deleteCourse);
router.post("/enroll/:id/enroll", controller.enrollStudent);

module.exports = router;
