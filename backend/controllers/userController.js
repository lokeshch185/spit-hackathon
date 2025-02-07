const {User} = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


const signup = async (req, res) => {

  const JWT_SECRET = process.env.JWT_SECRET;


  const { username, name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = await fetchLeetcodeData(username);
    const score = calculateScore(userData);

    const user = new User({
      ...userData,
      score,
      realName:name,
      password:hashedPassword,
      email: email,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
};

const signin = async (req, res) => {
  const { username, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;
console.log(username + "signedIn")


  try {
    
    const user = await User.findOne({ username }).select('profileImage realName username score password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const data = {
      profileImage: user.profileImage,
      realName: user.realName,
      username: user.username,
      score: user.score
    };

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Signed in successfully', token, data });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getUserSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    
    const suggestions = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { realName: { $regex: query, $options: 'i' } },
      ],
    })
      .select('username realName score profileImage') 
      .limit(10) 
      .sort({ score: -1 }); 

    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, signin, getUserSuggestions };