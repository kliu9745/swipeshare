/**
 * Minimal in-browser user service (in-memory)
 * Mirrors the server `userService` API used by frontend code.
 */

class UserService {
  constructor() {
    this.users = new Map();
  }

  createUser(user) {
    if (!user || !user.id) return null;
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id) {
    return this.users.get(id) || null;
  }

  getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }
}

export default new UserService();
