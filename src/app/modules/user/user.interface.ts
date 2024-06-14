// export type TUserName = {
//   firstName: string;
//   middleName: string;
//   lastName: string;
// };

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user';
  address: string;
};
