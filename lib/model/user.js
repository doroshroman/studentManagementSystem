class User{
    constructor(first, last, patronymic){
        this.name = {
            first,
            last,
            patronymic
        };
        this.permissions = new Map();

    }
    addPermission(permission){
        this.permissions.set(permission.id, permission);
    }
    editPermission(id){
        // 
    }
    deletePermission(id){
        this.permissions.delete(id);
    }
    

}