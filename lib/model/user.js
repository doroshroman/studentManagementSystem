class User{
    constructor(first, last, patronymic, email, password){
        this.name = {
            first,
            last,
            patronymic,
           
        };
        this.email = email;
        this.password = password;
        this.permissions = [];

    }
    addPermission(permission){
        this.permissions.push(permission);
    }
    editPermission(id){
        // 
    }
    deletePermission(id){
        //this.permissions.delete(id);
    }
    

}
module.exports = User;