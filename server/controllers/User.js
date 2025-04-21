import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

dotenv.config();

// Register
export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createError(409, "Email is already in use."));

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const user = new User({ name, email, password: hashedPassword, img });
    const createdUser = await user.save();

    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user: createdUser });
  } catch (error) {
    return next(error);
  }
};

// Login
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) return next(createError(403, "Incorrect password"));

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

// Dashboard
export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      { $group: { _id: null, totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
    ]);

    const totalWorkouts = await Workout.countDocuments({
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    const pieChartData = categoryCalories.map((cat, i) => ({
      id: i,
      value: cat.totalCaloriesBurnt,
      label: cat._id,
    }));

    const weeks = [];
    const caloriesBurnt = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 86400000);
      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const dailyData = await Workout.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
      ]);

      caloriesBurnt.push(dailyData[0]?.totalCaloriesBurnt || 0);
    }

    return res.status(200).json({
      totalCaloriesBurnt: totalCaloriesBurnt[0]?.totalCaloriesBurnt || 0,
      totalWorkouts,
      avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: {
        weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData,
    });
  } catch (err) {
    next(err);
  }
};

// Workouts by date
export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const date = req.query.date ? new Date(req.query.date) : new Date();

    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const workouts = await Workout.find({
      user: userId,
      date: { $gte: start, $lt: end },
    });

    const totalCaloriesBurnt = workouts.reduce(
      (acc, workout) => acc + workout.caloriesBurned,
      0
    );

    res.status(200).json({ todaysWorkouts: workouts, totalCaloriesBurnt });
  } catch (err) {
    next(err);
  }
};

// Add workout
export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;

    if (!workoutString) return next(createError(400, "Workout string is missing"));

    const eachWorkout = workoutString.split(";").map((line) => line.trim());

    const parsedWorkouts = [];
    let currentCategory = "";
    let count = 0;

    for (const line of eachWorkout) {
      count++;

      if (line.startsWith("#")) {
        const parts = line.split("\n").map((p) => p.trim());

        if (parts.length < 5) {
          return next(createError(400, `Workout string is missing for ${count}th workout`));
        }

        currentCategory = parts[0].substring(1).trim();
        const workoutDetails = parseWorkoutLine(parts);

        if (!workoutDetails) {
          return next(createError(400, "Please enter in proper format"));
        }

        workoutDetails.category = currentCategory;
        workoutDetails.caloriesBurned = parseFloat(calculateCaloriesBurnt(workoutDetails));

        const savedWorkout = await Workout.create({ ...workoutDetails, user: userId });
        parsedWorkouts.push(savedWorkout);
      } else {
        return next(createError(400, `Workout string is missing for ${count}th workout`));
      }
    }

    return res.status(201).json({
      message: "Workouts added successfully",
      workouts: parsedWorkouts,
    });
  } catch (err) {
    next(err);
  }
};

// Parse workout line
const parseWorkoutLine = (parts) => {
  try {
    return {
      workoutName: parts[1].substring(1).trim(),
      sets: parseInt(parts[2].split("sets")[0].substring(1).trim()),
      reps: parseInt(parts[2].split("sets")[1].split("reps")[0].substring(1).trim()),
      weight: parseFloat(parts[3].split("kg")[0].substring(1).trim()),
      duration: parseFloat(parts[4].split("min")[0].substring(1).trim()),
    };
  } catch {
    return null;
  }
};

// Calories calculation
const calculateCaloriesBurnt = (workout) => {
  const duration = parseFloat(workout.duration);
  const weight = parseFloat(workout.weight);
  const caloriesPerMinute = 5;
  return duration * caloriesPerMinute * weight;
};
