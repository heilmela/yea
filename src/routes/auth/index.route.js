import { route, POST, before, inject } from 'awilix-express';
@route('/auth')
export default class AuthRoute {
  constructor({ logger, tokenService, userService, User }) {
    this.logger = logger;
    this.tokenService = tokenService;
    this.userService = userService;
    this.User = User;
  }

  @route('/login')
  @POST()
  @before(inject(({ authValidator }) => authValidator.credentials()))
  async login(req, res) {
    const user = await this.User.findOne({ emails: req.body.email });

    if (!user) return res.status(401).send('Invalid credentials.');

    if (user.password) {
      let isValidPassword = await user.isValidPassword(
        req.body.password,
      );
      if (!isValidPassword)
        return res.status(401).send('Invalid credentials.');
    }

    let tokens = this.tokenService.createTokens(user.id);
    return res.send(tokens);
  }

  @route('/refresh')
  @POST()
  @before(inject(({ authValidator }) => authValidator.refresh()))
  async refresh(req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);

    this.tokenService.verifyRefreshToken(refreshToken).then(
      async (payload) => {
        let token = await this.tokenService.createAuthToken(payload);
        res.send({ authToken: token });
      },
      (error) => {
        return res.sendStatus(403);
      },
    );
  }

  @route('/register')
  @POST()
  @before(inject(({ authValidator }) => authValidator.credentials()))
  async register(req, res) {
    let user = await this.User.findOne({ emails: req.body.email });
    if (user) return res.status(401).send('Mail already registered.');

    user = await this.userService.createUser(
      req.body.email,
      req.body.password,
    );
    const tokens = {
      authToken: user.authToken,
      refreshToken: user.refreshToken,
    };
    return res.status(200).send({ user: user, tokens: tokens });
  }
}
