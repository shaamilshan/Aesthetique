const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { Schema } = mongoose;

const ALL_FEATURES = [
  "dashboard",
  "products",
  "categories",
  "orders",
  "payments",
  "coupons",
  "users",
  "banners",
  "announcements",
  "faqs",
];

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    dateOfBirth: {
      type: Date,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "superAdmin"],
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    profileImgURL: {
      type: String,
    },
    profileImageURL: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.statics.signup = async function (
  userCredentials,
  role,
  isEmailVerified
) {
  const { email, password, passwordAgain, firstName, lastName } =
    userCredentials;

  // Require only firstName, email and password for signup
  if (!firstName || !email || !password || !role) {
    throw Error("First name, email and password are required");
  }

  if (String(firstName).trim() === "") {
    throw Error("First name is required");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  // Checking if the email is already registered.
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  userCredentials["password"] = hash;

  // remove passwordAgain if provided (guard in case userCredentials isn't a plain object)
  if (
    userCredentials &&
    typeof userCredentials === "object" &&
    Object.prototype.hasOwnProperty.call(userCredentials, "passwordAgain")
  ) {
    delete userCredentials["passwordAgain"];
  }

  // Normalize permissions field from incoming data (could be array, stringified JSON or single string)
  let permissionsNormalized = [];
  if (role === "superAdmin") {
    // superAdmin gets full access
    permissionsNormalized = ALL_FEATURES;
  } else if (userCredentials.permissions) {
    if (Array.isArray(userCredentials.permissions)) {
      permissionsNormalized = userCredentials.permissions;
    } else if (typeof userCredentials.permissions === "string") {
      try {
        const parsed = JSON.parse(userCredentials.permissions);
        if (Array.isArray(parsed)) permissionsNormalized = parsed;
        else permissionsNormalized = [userCredentials.permissions];
      } catch (e) {
        permissionsNormalized = [userCredentials.permissions];
      }
    }
  }

  const user = await this.create({
    ...userCredentials,
    isActive: true,
    role,
    isEmailVerified,
    permissions: permissionsNormalized,
  });

  user.password = "";

  return user;
};

UserSchema.statics.managersignup = async function (
  userCredentials,
  role,
  isEmailVerified
) {
  const { email, password, passwordAgain, firstName, lastName } =
    userCredentials;

  

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  userCredentials["password"] = hash;

  if (
    userCredentials &&
    typeof userCredentials === "object" &&
    Object.prototype.hasOwnProperty.call(userCredentials, "passwordAgain")
  ) {
    delete userCredentials["passwordAgain"];
  }

  // Normalize permissions for managers/superAdmin creation
  let permissionsNormalized = [];
  if (role === "superAdmin") {
    permissionsNormalized = ALL_FEATURES;
  } else if (userCredentials.permissions) {
    if (Array.isArray(userCredentials.permissions)) {
      permissionsNormalized = userCredentials.permissions;
    } else if (typeof userCredentials.permissions === "string") {
      try {
        const parsed = JSON.parse(userCredentials.permissions);
        if (Array.isArray(parsed)) permissionsNormalized = parsed;
      } catch (e) {
        permissionsNormalized = [userCredentials.permissions];
      }
    }
  }

  const user = await this.create({
    ...userCredentials,
    isActive: true,
    role,
    isEmailVerified,
    permissions: permissionsNormalized,
  });

  user.password = "";

  return user;
};

UserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  let user = await this.findOne({ email });
  if (!user) {
    throw Error("This email is not registered. Please check!");
  }
  if (!user.isActive) {
    throw Error(
      "Your account is blocked. Contact customer care for further details"
    );
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect Password");
  }

  user.password = "";

  return user;
};

UserSchema.statics.changePassword = async function (
  _id,
  currentPassword,
  password,
  passwordAgain
) {
  if (password !== passwordAgain) {
    throw Error("Password doesn't match");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }
  const exists = await this.findOne({ _id });
  if (!exists) {
    throw Error("Cannot find email");
  }

  const match = await bcrypt.compare(currentPassword, exists.password);

  if (!match) {
    throw Error("Current Password is wrong");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  let user = await this.updateOne({ _id }, { $set: { password: hash } });
  console.log(user);

  user.password = "";

  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
