export default class UserService {
  constructor({ Invitation, User, tokenService }) {
    this.User = User;
    this.Invitation = Invitation;
    this.tokenService = tokenService;
  }

  async getUser(params) {
    return this.User.findOne(params).then((response) => {
      response.toObject();
    });
  }

  async createUser(email, password) {
    var user = await this.User.findOne({ emails: email });
    if (user) return false;

    user = new this.User({
      emails: [email],
      ...(password ? { password: password } : {}),
    });
    let validation = user.isValidEmail(email);
    if (validation.error)
      return res.status(400).send('Invalid email');
    await user.save();

    let payload = this.tokenService.createPayload(user.id);
    const auth_token = await this.tokenService.createAuthToken(
      payload,
    );
    const refresh_token = await this.tokenService.createRefreshToken(
      payload,
    );

    user.authToken = auth_token;
    user.refreshToken = refresh_token;
    user.userId = user.id;

    return user;
  }
}
