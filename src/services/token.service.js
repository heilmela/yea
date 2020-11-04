export default class TokenService {
  constructor({ jwt, config, logger }) {
    this.jwt = jwt;
    this.config = config;
    this.logger = logger;
  }
  async createAuthToken(payload) {
    const token = await this.jwt.sign(
      { data: payload },
      this.config.authentication.secret,
      { expiresIn: this.config.authentication.expiration },
    );
    return token;
  }

  async verifyAuthHeader(req) {
    var header = req.header('Authorization');
    if (!header) header = req.headers.authorization;
    const token = header && header.split(' ')[1];
    if (token == null) throw 'Authentication header empty';
    return this.verifyAuthToken(token);
  }
  async createRefreshToken(payload) {
    const token = await this.jwt.sign(
      { data: payload },
      this.config.authentication.secret,
    );
    return token;
  }
  async verifyAuthToken(token) {
    return new Promise((resolve, reject) => {
      this.jwt.verify(
        token,
        this.config.authentication.secret,
        (err, payload) => (err ? reject(err) : resolve(payload.data)),
      );
    });
  }
  async verifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
      this.jwt.verify(
        token,
        this.config.authentication.secret,
        (err, payload) => (err ? reject(err) : resolve(payload.data)),
      );
    });
  }

  async createTokens(payload) {
    const parsedPayload = this.createPayload(payload);
    const authToken = await this.createAuthToken(parsedPayload);
    const refreshToken = await this.createRefreshToken(parsedPayload);
    return { authToken: authToken, refreshToken: refreshToken };
  }

  createPayload(userId) {
    var payload = { userId: userId };
    return payload;
  }
}
