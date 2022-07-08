import cookie from "react-cookies";

export const setOwner = (ownerId) => {
    localStorage.setItem("ownerId", JSON.stringify(ownerId));
    localStorage.setItem("switch_status", true)
}

export const setTreePan = (value) =>{
    localStorage.setItem("treePan", value)
}

export const getTreePan = () =>{
    return localStorage.getItem("treePan") == "true"? true:false
}

export const setUserName = (name) => {
    localStorage.setItem("userName", JSON.stringify(name));
}

export const setUserCheck = (check) => {
    cookie.save('checkUser', check, { path: '/' });
}

export const getUserCheck = () => {
    return cookie.load('checkUser') || null;
}

export const removeCookies = () => {
    localStorage.clear();
    cookie.remove('checkUser', { path: '/' });
    cookie.remove('accessCode', { path: '/' });
    cookie.remove('accessToken', { path: '/' });
    cookie.remove('recent-tree', { path: '/' });
    cookie.remove('userFlow', { path: '/' });
}

export const setAccessCode = (accessCode) => {
    cookie.save('accessCode', accessCode, { path: '/' });
}

export const getAccessCode = () => {
    return cookie.load('accessCode') || null;
}

export const setUserId = (id) => {
    localStorage.setItem("userId", JSON.stringify(id));
}

export const setAccessToken = (accessToken) => {
    cookie.save('accessToken', accessToken, { path: '/' });
}

export const setUserFlow = (userFlow) => {
    cookie.save('userFlow', userFlow, { path: '/' });
}

export const getAccessToken = () => {
    return cookie.load('accessToken') || null;
}

export const getUserFlow = () => {
    return cookie.load('userFlow') || null;
}

export const getOwner = () => {
    return JSON.parse(localStorage.getItem("ownerId")) || null;
}

export const getUserName = () => {
    return JSON.parse(localStorage.getItem("userName")) || null;
}

export const setCardTooltip = (value) => {
    localStorage.setItem("card-tooltip", value);
}

export const setNewTree = (value) => {
    localStorage.setItem("new-tree", value);
}

export const getNewTree = () => {
    return localStorage.getItem("new-tree")
}

// Recent Family Tree
export const setRecentTree = (recentTree) => {
    cookie.save('recent-tree', recentTree, { path: '/' });
}

export const getRecentTree = () => {
    return cookie.load('recent-tree') || null;
}

export const removeRecentTree = () => {
    cookie.remove('recent-tree', { path: '/' });
}
export const isUserOwner=userId=>userId===getOwner()?true:false

export const setIsPrivileged = (isPrivileged) => {
  localStorage.setItem("isPrivileged", JSON.stringify(isPrivileged));
}

export const getIsPrivileged= () => {
  return JSON.parse(localStorage.getItem("isPrivileged"));
}
