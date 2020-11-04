import {
  route,
  POST,
  GET,
  PUT,
  before,
  inject,
} from 'awilix-express';
@route('/user')
export default class UserRoute {
  constructor({ userService, logger, tokenService, User }) {
    this.userService = userService;
    this.logger = logger;
    this.tokenService = tokenService;
    this.User = User;
  }
  @route('')
  @GET()
  async findAll(req, res) {
    const users = await this.User.find();
    res.status(200).send(users);
  }

  @route('/me')
  @GET()
  @before(
    inject(({ authorizationMiddleware }) => authorizationMiddleware),
  )
  @before(
    inject(({ commonValidator }) => commonValidator.id_in_params()),
  )
  async findMe(req, res) {
    try {
      const user = await this.User.findOne({ id: req.params.id });
      if (!user) return res.status(404).send('User not found');
      return res.status(200).send(user);
    } catch {
      res.status(400).send('Invalid ID');
    }
  }
  @route('')
  @PUT()
  @before(inject(({ userValidator }) => userValidator.update()))
  async update(req, res) {
    try {
      const user = await this.User.findOne({ id: req.body.id });
      if (!user) return res.status(404).send('User not found');
      const newUser = await this.User.findOneAndUpdate(
        { id: req.body.id },
        req.body,
        { new: true },
      );
      res.status(200).send(newUser);
    } catch {
      res.status(400).send('Invalid ID');
    }
  }

  @route('/filter')
  @POST()
  @before(inject(({ userValidator }) => userValidator.filter()))
  async filter(req, res) {
    const user = await this.User.find(req.body);
    return res.status(200).send(user);
  }

  @route('/:id')
  @GET()
  @before(
    inject(({ commonValidator }) => commonValidator.id_in_params()),
  )
  async findOne(req, res) {
    try {
      const user = await this.User.findOne({
        id: req.params.id,
      });
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send(user);
      }
    } catch {
      return res.status(400).send('Invalid ID');
    }
  }
}
