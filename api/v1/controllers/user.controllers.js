const md5 = require("md5");
const User = require("../model/user.model");
const ForgotPassword = require("../model/forgot-password.model");
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");
//[POST] //api/v1/users/register
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password);
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    res.json({
      code: 400,
      message: "email đã tồn tại",
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateHelper.generateRandomString(30),
    });
    user.save();
    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      token: token,
      message: "tạo thành công",
    });
  }
};
//[POST] //api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "email ko tồn tại",
    });
    return;
  }
  if (md5(password) != user.password) {
    res.json({
      code: 400,
      message: "sai mật khẩu",
    });
    return;
  }
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "đăng nhập thành công",
    token: token,
  });
};
//[POST] //api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "email không tồn tại",
    });
    return;
  }
  const otp = generateHelper.generateRandomNumber(8);
  const timeExpire = 1;
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: new Date(Date.now() + timeExpire * 60 * 1000),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  // gửi otp qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
  <h3>Xin chào,</h3>
      <p>Mã OTP của bạn là: <b>${otp}</b></p>
      <p>OTP có hiệu lực trong ${timeExpire} phút, sau đó sẽ hết hạn.</p>
      <p>Nếu không phải bạn, hãy bỏ qua email này.</p>
  `;
  sendMailHelper.sendMail(email, subject, html);
  res.json({
    code: 200,
    message: "đã gửi mã OTP qua email",
  });
};
//[POST] //api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    res.json({
      code: 400,
      message: "Mã OTP không hợp lệ",
    });
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "xác thực thành công",
    token: token,
  });
};
//[POST] //api/v1/users/password/resetPassword
module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  const user = await User.findOne({
    token: token,
  });
  if (md5(password) == user.password) {
    res.json({
      code: 400,
      message: "vui lòng nhập mật khẩu mới khác mật khẩu cũ",
    });
    return;
  }
  await User.updateOne(
    {
      token: token,
    },
    {
      password: md5(password),
    }
  );
  res.json({
    code: 200,
    message: "đổi mật khẩu thành công",
  });
};
//[GET] //api/v1/users/detail
module.exports.detail = async (req, res) => {
  try {
    res.json({
      code: 200,
      info: req.user,
      message: "thành công",
    });
  } catch (error) {
    res.json({
      code: 200,
      message: "thất bại",
    });
  }
};
