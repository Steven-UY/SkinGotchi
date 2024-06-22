//model for User object
class User {
    constructor(id, firstname, lastname, email, password, skintype, skinproblems) {
      (this.id = id),
        (this.firstname = firstname),
        (this.lastname = lastname),
        (this.email = email),
        (this.password = password),
        (this.skintype = skintype),
        (this.skinproblems = Array.isArray(skinproblems) ? skinproblems : []);
    }
  }
  
  export default User;