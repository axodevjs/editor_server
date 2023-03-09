import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  async registration(req, res) {
    try {
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `Пользователь с email ${email} уже существует` });
      }
      const hashPassword = await bcrypt.hash(password, 8);
      const user = new User({ email, password: hashPassword });
      await user.save();

      return res.json({ message: "Пользователь успешно создан" });
    } catch (e) {
      console.log(e);
      return res.send({ message: "Server error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json("Неправильный email или пароль");
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Неправильный email или пароль" });
      }
      const isPassValid = bcrypt.compareSync(password, user.password);
      if (!isPassValid) {
        return res
          .status(404)
          .json({ message: "Неправильный email или пароль" });
      }
      const token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: "1h",
      });
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (e) {
      console.log(e);
      return res.send({ message: "Server error" });
    }
  }

  async auth(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      const token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: "24h",
      });
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (e) {
      console.log(e);
      res.send({ message: "Server error" });
    }
  }
}

export default new UserController();
