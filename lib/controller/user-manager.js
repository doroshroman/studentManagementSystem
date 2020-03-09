class UsersManager{
    constructor(){
        this.users = new Map();
        this.user_id = 0;
    }
    addUser(user){
        user.id = this.user_id;
        this.users.set(user.id, user);
        this.user_id++;
    }
    deleteUser(id){
        this.users.delete(id);
        this.user_id--;
    }


}
export default UsersManager;