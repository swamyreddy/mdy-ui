export interface Lead {
  reason: 'Investment' | 'Self Use';
  dealer: 'Yes' | 'No';
  name: string;
  phone: string;
  email: string;
  productId: number;
  createdAt?: string;
  updatedAt?: string;
  id?: string; // if you're returning the lead from MongoDB
}
