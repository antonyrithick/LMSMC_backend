const Class = require("../models/class");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");


exports.createCourse = async (req, res) => {
  try {
    const { title, description, defaultPrice, rating, classes } = req.body;

    const courseThumbnail = req.files?.courseThumbnail?.[0]?.filename;

    const course = await Course.create({
      title,
      description,
      defaultPrice,
      rating,
      thumbnail: courseThumbnail,
    });

    const parsedClasses = JSON.parse(classes); // classes is a JSON string

    const classList = parsedClasses.map((cls, index) => ({
      title: cls.title,
      content: cls.content,
      order: index + 1,
      CourseId: course.id,
      thumbnail: req.files?.[`classThumbnail${index}`]?.[0]?.filename || null,
    }));

    await Class.bulkCreate(classList);

    res.status(201).json({ course, message: "Course and classes created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [Class, Enrollment],
      order: [['createdAt', 'DESC']]
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [Class, Enrollment],
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    await course.update(req.body);
    res.json({ course, message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    await course.destroy();
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const { studentName } = req.body;
    const course = await Course.findByPk(req.params.id, { include: Enrollment });
    if (!course) return res.status(404).json({ error: "Course not found" });

    const studentCount = course.Enrollments.length + 1;
    let finalPrice = course.defaultPrice;

    if (studentCount === 1) finalPrice *= 3;
    else if (studentCount === 2) finalPrice *= 2;

    const enrollment = await Enrollment.create({
      studentName,
      finalPrice,
      CourseId: course.id,
    });

    res.status(201).json({ enrollment, message: "Student enrolled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
