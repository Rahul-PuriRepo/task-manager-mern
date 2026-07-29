const Task = require("../models/task.model");

const createTask = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

const taskData = {
    ...req.body,
    linkedFile: req.file ? req.file.path : null,
};
    const data = await Task.create(taskData);

    console.log(data);

    return res.status(201).json({message: "Task created successfully",
      data});
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const data = await Task.find({});

    return res.status(200).json({
      message: "Tasks fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
    {
        return res.status(404).json({
      message: "Task not found."
    });   
    }

    return res.status(200).json({
        message: "Task fetched successfully",
        data: task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};
const updateTaskById = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
    };

    if (req.file) {
        updatedData.linkedFile = req.file.path;
    }

    const task = await Task.findByIdAndUpdate(
    req.params.id,
    updatedData,
    {
        new: true,
        runValidators: true,
    }
   );

    if (!task)
    {
        return res.status(404).json({
      message: "Task not found."
    });   
    }

    return res.status(200).json({
        message: "Task updated successfully",
        data: task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
};
const deleteTaskById = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task)
    {
        return res.status(404).json({
            message: "Task not found"
    });   
    }

    return res.status(200).json({
        message: "Task deleted successfully",
        data: task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
};
const markTaskAsDone = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                status: "DONE",
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        return res.status(200).json({
            message: "Task marked as DONE successfully",
            data: task,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update task status",
            error: error.message,
        });
    }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  markTaskAsDone
};