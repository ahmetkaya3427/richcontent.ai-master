interface AuthUser {
  name: string;
  surname: string;
  email: string;
  phone: string;
  username: string;
  credit: number;
  role: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    surname: "",
    email: "",
    phone: "",
    username: "",
    credit: 0,
    role: "",
  }),
  actions: {
    setUser(user: AuthUser) {
      this.name = user.name;
      this.surname = user.surname;
      this.email = user.email;
      this.phone = user.phone;
      this.username = user.username;
      this.credit = user.credit;
      this.role = user.role;
    },
    setCredit(credit: number) {
      this.credit = credit;
    },
    reset() {
      this.name = "";
      this.surname = "";
      this.email = "";
      this.phone = "";
      this.username = "";
      this.credit = 0;
      this.role = "";
    },
  },
});
