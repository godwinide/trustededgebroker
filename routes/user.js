const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../model/User");
const History = require("../model/History");
const bcrypt = require("bcryptjs");
const comma = require("../utils/comma");

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    try {
        return res.render("dashboard", { pageTitle: "Dashbaord", req, comma, layout: false });
    } catch (err) {
        return res.redirect(303, "/");
    }
});

router.get("/fund_account", ensureAuthenticated, (req, res) => {
    try {
        return res.render("deposit", { pageTitle: "Fund Account", comma, req });
    } catch (err) {
        return res.redirect(303, "/");
    }
});

router.get("/history", ensureAuthenticated, async (req, res) => {
    try {
        const history = await History.find({ userID: req.user.id });
        return res.render("history", { pageTitle: "History", history, req });
    } catch (err) {
        return res.redirect(303, "/");
    }
});

router.get("/withdraw", ensureAuthenticated, (req, res) => {
    try {
        return res.render("withdraw", { pageTitle: "Withdraw Funds", comma, req });
    } catch (err) {
        return res.redirect(303, "/");
    }
});

router.get("/pin/:amount", ensureAuthenticated, (req, res) => {
    try {
        const { amount } = req.params;
        return res.render("PIN", { pageTitle: "Enter PIN", comma, amount, req });
    } catch (err) {
        console.log(err);
        return res.redirect(303, "/");
    }
});

router.post("/pin/:amount", ensureAuthenticated, async (req, res) => {
    try {
        const { pin } = req.body;
        const { amount } = req.params;
        if (!pin) {
            req.flash("error_msg", "Please enter withdrawal PIN or contact support");
            return res.redirect(`/pin/${amount}`);
        }
        if (pin != req.user.pin || !req.user.pin) {
            req.flash("error_msg", "You have entered an incorrect PIN");
            return res.redirect(`/pin/${amount}`);
        }

        const hist = new History({
            amount,
            user: req.user,
            userID: req.user.id,
            type: "Withdrawal",
            status: "pending"
        });
        await hist.save();
        await User.updateOne({ _id: req.user.id }, {
            balance: Number(req.user.balance) - Number(amount)
        })
        return res.redirect(303, "/pending")
        // req.flash("success_msg", "Your withdrawal request is pending.");
        // return res.redirect(`/pin/${amount}`);
    } catch (err) {
        console.log(err);
        return res.redirect(303, "/");
    }
});

router.get("/pending", ensureAuthenticated, (req, res) => {
    try {
        const { amount } = req.params;
        return res.render("pending", { pageTitle: "Pending", comma, amount, req });
    } catch (err) {
        console.log(err);
        return res.redirect(303, "/");
    }
});

router.post("/withdraw", ensureAuthenticated, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) {
            req.flash("error_msg", "Please enter amount to withdraw");
            return res.redirect(303, "/withdraw");
        }
        if (req.user.balance < amount || amount < 0) {
            req.flash("error_msg", "Insufficient balance. try and deposit.");
            return res.redirect(303, "/withdraw");
        }
        return res.redirect(`/pin/${amount}`);
    } catch (err) {
        console.log(err)
        return res.redirect(303, "/");
    }
});

router.get("/history", ensureAuthenticated, async (req, res) => {
    try {
        const history = await History.find({ userID: req.user.id });
        return res.render("history", { pageTitle: "History", history, req });
    } catch (err) {
        return res.redirect(303, "/");
    }
});

router.get("/profile", ensureAuthenticated, async (req, res) => {
    try {
        return res.render("profile", { pageTitle: "Profile", comma, req });
    } catch (err) {
        return res.redirect(303, "/");
    }
});

router.get("/change_password", ensureAuthenticated, async (req, res) => {
    try {
        return res.render("change_password", { pageTitle: "Change Password", req });
    } catch (err) {
        return res.redirect(303, "/");
    }
});

router.post("/change_password", ensureAuthenticated, async (req, res) => {
    try {
        const { password, password2 } = req.body;
        console.log(req.body);
        if (!password || !password2) {
            req.flash("error_msg", "Please provide fill all fields");
            return res.redirect(303, "/change_password");
        }
        else if (password !== password2) {
            req.flash("error_msg", "Both passwords must be same");
            return res.redirect(303, "/change_password");
        }
        else if (password.length < 6) {
            req.flash("error_msg", "Password too short")
            return res.redirect(303, "/change_password");
        } else {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password2, salt);
            await User.updateOne({ _id: req.user.id }, {
                password: hash
            });
            req.flash("success_msg", "password updated successfully");
            return res.redirect(303, "/change_password");
        }

    } catch (err) {
        console.log(err);
        return res.redirect(303, "/");
    }
})

router.get("/account_upgrade", ensureAuthenticated, (req, res) => {
    try {
        return res.render("upgrade", { pageTitle: "Account Upgrade", req });
    } catch (err) {
        return res.redirect(303, "/");
    }
});


module.exports = router;