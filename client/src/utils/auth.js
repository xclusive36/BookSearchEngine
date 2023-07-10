import decode from "jwt-decode"; // import decode from jwt-decode

class AuthService {
  // create a new class called AuthService
  getProfile() {
    // create getProfile method
    return decode(this.getToken()); // use jwt-decode to decode the token
  }

  loggedIn() {
    // create loggedIn method
    const token = this.getToken(); // get token from localStorage
    return !!token && !this.isTokenExpired(token); // check if token exists and is not expired
  }

  isTokenExpired(token) {
    // create isTokenExpired method
    try {
      const decoded = decode(token); // decode token
      if (decoded.exp < Date.now() / 1000) {
        // check if token is expired and return true or false
        return true;
      } else return false;
    } catch (err) {
      // catch error
      return false; // return false if error
    }
  }

  getToken() {
    // create getToken method
    return localStorage.getItem("id_token"); // retrieve token from localStorage
  }

  login(idToken) {
    // create login method
    localStorage.setItem("id_token", idToken); // save token to localStorage
    window.location.assign("/"); // reload window
  }

  logout() {
    // create logout method
    localStorage.removeItem("id_token"); // remove token from localStorage
    window.location.assign("/"); // reload window
  }
}

export default new AuthService(); // export AuthService
