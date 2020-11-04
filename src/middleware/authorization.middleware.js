export default function authorize({ tokenService }) {
  return async (req, res, next) => {
    try {
      let payload = await tokenService.verifyAuthHeader(req);
      req.userId = payload.userId;
      next();
    } catch {
      res.sendStatus(401);
    }
  };
}
