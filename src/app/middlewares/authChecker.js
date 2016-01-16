import compose from 'composable-middleware';

/**
 * Set token cookie directly for oAuth strategies
 */
const verifySession = () => {
  return compose()
  .use((req, res, next) => {
    if (req.session.loginUser) {
      req.user = req.session.loginUser;
      return next();
    }
    return next({message: '无法验证用户信息', status: 401});
  });
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */
const hasRole = (roleRequired) => {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }
  return compose()
  .use(verifySession())
  .use((req, res, next) => {
    if (req.user.roles && req.user.roles.indexOf(roleRequired) > -1) {
      return next();
    }
    return next({message: '权限不足', status: 403});
  });
};

export default {
  verifySession,
  hasRole,
};
