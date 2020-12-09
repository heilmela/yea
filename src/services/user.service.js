export default class UserService {
  constructor({ User, tokenService, logger }) {
    this.User = User;
    this.tokenService = tokenService;
    this.logger = logger;
  }

  async getUser(params) {
    console.log(params);
    return this.User.findOne(params).then((response) => {
      if(response) return response.toObject();
      if(!response) throw 'Couldnt find User';
    });
  }

  async login(email, password) {
    let user = await this.User.findOne({
      email: email,
    });

    if (!user) {
      this.logger.debug('Could not find User by email');  
      throw 'Couldnt find User';
    } 

    if (user.password) {
      let isValidPassword = await user.isValidPassword(
        password,
      );
      if (!isValidPassword) {
        this.logger.debug('Invalid Password');
        throw 'Invalid Password'
      } 
    }
    user = user.toObject();
    const auth_token = await this.tokenService.createAuthToken(
      payload,
    );
    const refresh_token = await this.tokenService.createRefreshToken(
      payload,
    );
    user.authToken = auth_token;
    user.refreshToken = refresh_token;
    return user;
  }

  async createUser(email, password) {
    var user = await this.User.findOne({ email: email });
    if (user) return false;

    user = new this.User({
      email: email,
      password: password
    });
    let validation = user.isValidEmail(email);
    if (validation.error)
      throw ('Invalid email');
    await user.save();

    let payload = this.tokenService.createPayload(user.id);
    const auth_token = await this.tokenService.createAuthToken(
      payload,
    );
    const refresh_token = await this.tokenService.createRefreshToken(
      payload,
    );
    user = user.toObject();
    user.authToken = auth_token;
    user.refreshToken = refresh_token;
    return user;
  }
}
