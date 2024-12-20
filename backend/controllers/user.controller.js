import User from "../mongodb/models/user.js";
import Currency from "../mongodb/models/currency.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).limit(req.query._end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.params; // Assuming email is passed as a route parameter
    const user = await User.findOne({ email }); // Search for the user by email

    if (user) {
      return res.status(200).json({
        message: "User exists",
        user, // Return the user details
      });
    } else {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) return res.status(200).json(userExists);

    const currentDate = new Date();

    const currency = await Currency.create({
      baseCurrency: "USD", // or any default currency
      latestUpdatedTime: new Date(),
      targetCurrency: "USD", // or any default currency
    });

    const newUser = await User.create({
      name,
      email,
      avatar,
      updatedDate: currentDate,
      currency: currency._id,
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//for now just updating few parameters and not the email and password
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, phone_number, user_role, baseCurrency, targetCurrency } =
      req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const curCurrency = await User.findById(id)
      .populate("currency")
      .session(session);
    const curCurrencyId = curCurrency.currency._id;

    if (baseCurrency | appSelectedCurrency) {
      await Currency.findByIdAndUpdate(
        { _id: curCurrencyId },
        {
          baseCurrency,
          targetCurrency,
        }
      );
    }

    const currentDate = new Date();

    await User.findByIdAndUpdate(
      { _id: id },
      {
        address,
        phone_number,
        updatedDate: currentDate,
        user_role,
        currency: curCurrencyId,
      }
    );
    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserInfoByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).populate("allClients");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, getUser, createUser, getUserInfoByID, updateUser };
