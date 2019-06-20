import passport from 'passport';
import express from 'express';
import SocialLoginController from '../../controllers/socialLoginController';

const router = express.Router();
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
  '/login/facebook/callback',
  passport.authenticate('facebook', { session: false }), SocialLoginController.respondWithToken
);

export default router;
