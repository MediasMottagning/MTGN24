/*CAN DEFINE NEW TYPES HERE ex:*/

export type Invoice = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
    status: 'pending' | 'paid';
  };

/*Could be used if we need to check data recived from API*/

// user type
export interface User {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

// login form type
export interface LoginFormState {
  email: string;
  password: string;
}

// posts type home page
export interface Post {
  id: string;
  title: string;
  post: string;
}
