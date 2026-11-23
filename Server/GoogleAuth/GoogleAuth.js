const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const usermodel = require("../Schemas/Users");
const Profilemodel = require("../Schemas/Profile");

const secretKey = config.jwtSecret;

const generateToken = (data) => {
  const { _id } = data;
  const expiresIn = "7h";
  const payload = { _id };
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.googleCallbackUrl,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        async function createUser(profile) {
          return {
            name: profile.name.givenName,
            email: profile.email,
            password: "",
          };
        }

        const existingProfile = await Profilemodel.findOne({
          email: profile.email,
          name: profile.name.givenName,
        });

        if (existingProfile) {
          const existingUser = await usermodel.findOne({
            email: profile.email,
            name: profile.name.givenName,
          });

          if (!existingUser) {
            return done(new Error("User not found."));
          }

          const token = generateToken(existingProfile);
          return done(null, { profile: existingProfile, token });
        }

        const userDetail = await createUser(profile);
        const userData = await usermodel.create(userDetail);

        const userProfile = {
          name: profile.name.givenName,
          email: profile.email,
          posts: [],
          bio: "",
          communities: [],
          profilePic: config.defaultProfilePicUrl,
          user_id: userData._id,
        };

        const profileData = await Profilemodel.create(userProfile);
        const token = generateToken(profileData);

        return done(null, { profile: profileData, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
