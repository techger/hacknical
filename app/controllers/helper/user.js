
import session from './session';

const check = (params, sessions) => params.some(key => sessions[key]);

const checkSession = (params = []) => async (ctx, next) => {
  if (!check(params, ctx.session)) {
    ctx.body = {
      success: true,
      message: 'session 缺失，请登录',
      url: '/'
    };
    return;
  }
  await next();
};

const checkNotLogin = () => async (ctx, next) => {
  const checkResult = check(session.requiredSessions, ctx.session);
  if (checkResult) {
    const { githubLogin } = ctx.session;
    return ctx.redirect(`/${githubLogin}`);
  }
  await next();
};

const checkIfLogin = (redirect = '/')  => async (ctx, next) => {
  const checkResult = check(session.requiredSessions, ctx.session);
  if (!checkResult) {
    return ctx.redirect(redirect);
  }
  await next();
};

const checkIsEmail = email =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const checkValidateUser = () => async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;
  if (!githubLogin) {
    return ctx.redirect('/404');
  } else if (login !== githubLogin) {
    return ctx.redirect(`/${githubLogin}`);
  }
  await next();
};

const VALIDATE_DASHBOARD = new Set([
  'records',
  'archive',
  'visualize',
  'setting'
]);

const checkValidateDashboard = () => async (ctx, next) => {
  const { dashboardRoute } = ctx.params;
  const { githubLogin } = ctx.session;
  if (!VALIDATE_DASHBOARD.has(dashboardRoute)) return ctx.redirect(`/${githubLogin}`);
  await next();
};

export default {
  checkSession,
  checkIfLogin,
  checkNotLogin,
  checkIsEmail,
  checkValidateUser,
  checkValidateDashboard,
};
