 class Users {
    constructor(){
        this.list = []

    }

    addUser(user){
        this.list= [...this.list, user]
    }
    findUserById(id){
        const user = this.list.find(user => user.id !== id)
        return user;
    }
    removeUserId(id){
        this.list = this.list.filter(user => user.id !== id) 
    }
    getListOfUserInRoom(roomName){
        return this.list.filter(user => user.room === roomName)
    }
}

module.exports={ Users }