const User = require("../models/user");
const Wallet = require("../models/wallet");

exports.isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

exports.isWalletOwner = async (req, res, next) => {
  const wallet_id = req.params.wallet_id;
  try {
    const wallet = await Wallet.findById(wallet_id).populate("user");
    if (req.session.user._id.toString() !== wallet.user._id.toString()) {
      await req.session.destroy();
      return res.redirect("/");
    }
    next();
  } catch (err) {
    console.log(err);
    res.redirect("/500");
  }
};

exports.isAccountOwner = async (req, res, next) => {
  const user_id = req.params.user_id;
  try {
    const user = await User.findById(user_id);
    if (req.session.user._id.toString() !== user._id.toString()) {
      await req.session.destroy();
      return res.redirect("/login");
    }
    next();
  } catch (err) {
    console.log(err);
    res.redirect("/500");
  }
};
