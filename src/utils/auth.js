export const user = null;

export const getUserToken = () => {
  return localStorage.getItem('token');
}

export const getUser = () => {
  let user = localStorage.getItem('user');
  localStorage.setItem('userid', JSON.stringify(user));
  console.log('id', localStorage.getItem("userid"))
  return user && JSON.parse(user);
}

export const setUserToken = token => {
  localStorage.setItem('token', token);
}

export const setUser = user => {
  localStorage.setItem('user', JSON.stringify(user));
}

export const removeUserToken = () => {
  localStorage.removeItem('token');
}

export const removeUser = () => {
  localStorage.removeItem('user');
}

export const removeUserId = () => {
  localStorage.removeItem('currentUser');
}

export const removeAuth = () => {
  removeUserToken();
  removeUser();
  removeUserId();
}

export const checkPermission = (user, permission) => {
  return user &&
    user.Role &&
    user.Role.PermissionAccesses.find((permissionAccess) => {
      return (
        permissionAccess.Permission.type == permission
      )
    });
}
