export class User {
    constructor(public email: string, public name: string, private password: string) {}

    matches(another: User): boolean {
        return another != undefined && 
        another.email === this.email && 
        another.password === this.password
    }
}

export const users: {[key: string]: User} = {
    "jennifer@gmail.com": new User('jennifer@gmail.com', "Jennifer", "jennifer23"),
    "joao@gmail.com": new User('joao@gmail.com', "Joao", "joao23")
}