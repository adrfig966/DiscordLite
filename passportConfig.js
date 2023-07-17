const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/user");

const registerUser = async (email, password, done) => {
    try {
        const userExists = await User.findOne({email: email});
        if (userExists) {
            return done(null, false, {message: "Email already registered"});
        }
        const newUser = new User({email: email, password: password});
        await newUser.save();
        return done(null, newUser);
    } catch (err) {
        return done(err);
    }
};

const authenticateUser = async (email, password, done) => {
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return done(null, false, {message: "No user with that email"});
        }
            
        const passwordCorrect = await user.validPassword(password);
        if (!passwordCorrect) {
            return done(null, false, {message: "Password incorrect"});
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
};

module.exports = function(passport) {
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, registerUser));
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticateUser));
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
    //passport.serializeUser(User.serializeUser());
    //passport.deserializeUser(User.deserializeUser());
};