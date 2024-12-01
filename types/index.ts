export type User = {
  id: string;
  clerk_id: string;
  name: string;
  user_code: string;
  email: string;
  created_at: string;
  image: string;
  qrCodes: {
    id: string;
    name: string;
    url: string;
  }[];
};

export type Group = {
  id: string;
  name: string;
  hatianCount: number;
  hatians: Hatian[];
  users: {
    user: User;
  }[];
};

export type Hatian = {
  id: string;
  name: string;
  users: {
    user: User;
  }[];
  transactions: Transaction[];
};

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  paid_by_id: string;
  split_type: string;
  userExpenses: UserExpense[];
  users: {
    user: User;
  }[];
  paidBy: User;
  owed: number;
  paid: number;
  settled: boolean;
};

export type UserExpense = {
  id: string;
  paid: number;
  owed: number;
  user_id: string;
  settled: boolean;
};
