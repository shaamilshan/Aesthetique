const User = require("../../model/userModel");

// Getting all Customer to list on admin dashboard
const getCustomers = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      startingDate,
      endingDate,
    } = req.query;

  let filter = {};
  // allow client to request specific roles or all roles via ?role=<role>|all
  const { role } = req.query;

    if (status) {
      if (status === "active") {
        filter.isActive = true;
      } else {
        filter.isActive = false;
      }
    }

    if (search) {
      if (search.includes(" ")) {
        const [firstName, lastName] = search.split(" ");
        filter.firstName = { $regex: new RegExp(firstName, "i") };
        filter.lastName = { $regex: new RegExp(lastName, "i") };
      } else {
        filter.$or = [
          { firstName: { $regex: new RegExp(search, "i") } },
          { lastName: { $regex: new RegExp(search, "i") } },
        ];
      }
    }
    // Date
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    const skip = (page - 1) * limit;

    // Build final query filter. If role is provided and not 'all', filter by that role.
    // If role === 'all' then do not include role filter (return all roles).
    const roleFilter = role && role !== "all" ? { role } : {};

    // Getting all users (include role in response so UI can display it)
    const customers = await User.find(
      { ...roleFilter, ...filter },
      {
        password: 0,
        dateOfBirth: 0,
        // include role intentionally
        walletBalance: 0,
        isEmailVerified: 0,
      }
    )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalAvailableUsers = await User.countDocuments({
      ...roleFilter,
      ...filter,
    });

    res.status(200).json({ customers, totalAvailableUsers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Getting all Customer to list on admin dashboard
const getManagers = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      startingDate,
      endingDate,
    } = req.query;

    let filter = {};

    if (status) {
      if (status === "active") {
        filter.isActive = true;
      } else {
        filter.isActive = false;
      }
    }

    if (search) {
      if (search.includes(" ")) {
        const [firstName, lastName] = search.split(" ");
        filter.firstName = { $regex: new RegExp(firstName, "i") };
        filter.lastName = { $regex: new RegExp(lastName, "i") };
      } else {
        filter.$or = [
          { firstName: { $regex: new RegExp(search, "i") } },
          { lastName: { $regex: new RegExp(search, "i") } },
        ];
      }
    }
    // Date
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    const skip = (page - 1) * limit;

    // Getting all managers (now mapped to superAdmin role so UI can display it if needed)
    const customers = await User.find(
      { role: "superAdmin", ...filter },
      {
        password: 0,
        dateOfBirth: 0,
        // include role intentionally
        walletBalance: 0,
        isEmailVerified: 0,
      }
    )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalAvailableUsers = await User.countDocuments({
      role: "superAdmin",
      ...filter,
    });

    res.status(200).json({ customers, totalAvailableUsers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Not completed
const getCustomer = (req, res) => {
  const { id } = req.params;

  console.log(id);

  res.status(200).json({ msg: `User id ${id}` });
};

// Creating new Customer if needed for admin
const addCustomer = async (req, res) => {
  try {
    // Will be update later
    let formData = { ...req.body, isActive: true };
    const files = req?.files;

    if (files && files.length > 0) {
      formData.moreImageURL = [];
      formData.imageURL = "";
      files.map((file) => {
        if (file.fieldname === "imageURL") {
          formData.imageURL = file.path || file.filename;
        } else {
          formData.moreImageURL.push(file.path || file.filename);
        }
      });
    }

  // Use model's signup helper so password hashing and validation are applied
  const roleToUse = formData.role || "user";
  const customer = await User.signup(formData, roleToUse, true);

  res.status(200).json({ customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update customer fields such as role or isActive
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const update = {};
    if (typeof isActive !== "undefined") update.isActive = !!isActive;
    if (role) update.role = role;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No updatable fields provided" });
    }

    const customer = await User.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (!customer) {
      throw Error("No Such Customer");
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findOneAndDelete({ _id: id });

    if (!customer) {
      throw Error("No Such Customer");
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Block or unblock user
const blockOrUnBlockCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const customer = await User.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    );
    res.status(200).json({ customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  blockOrUnBlockCustomer,
  getManagers,
};
