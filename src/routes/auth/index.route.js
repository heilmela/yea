import { route, POST, before, inject } from 'awilix-express';
@route('/auth')
export default class AuthRoute {
  constructor({ logger, tokenService, userService }) {
    this.logger = logger;
    this.tokenService = tokenService;
    this.userService = userService;
  }

  @route('/login')
  @POST()
  @before(inject(({ authValidator }) => authValidator.credentials()))
  async login(req, res) {
    let { email, password } = req.body;
    try {
      const user = await this.userService.login(email, password);
      return res.send(user);
    } catch {
      return res.status(500).send('Internal Server Error');
    }
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
    let { email, password } = req.body;
    try {
      const user = await this.userService.createUser(email, password);
      let tokens = await this.tokenService.createTokens(user.id);
      return res.status(200).send({ user: user, tokens: tokens });
    } catch {
      return res.status(500).send('Internal Server Error');
    }
  }
}
