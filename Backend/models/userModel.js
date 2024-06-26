class User {
    constructor(firstname, lastname, email, password, skintype, skinproblems = []){
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.skintype = skintype;
        this.skinproblems = Array.isArray(skinproblems) ? skinproblems : [skinproblems];
    }
}

module.exports = User;