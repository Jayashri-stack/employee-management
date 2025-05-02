export interface Address {
  id?: number;
  address: string;
  location: string;
  pin: string;
  contact: string;
}

  
  export type Employee = {
    id: string;
    employeeNumber: string;
    name: string;
    email: string;
    organization: string;
    designation: string;
    number: string;
    addresses: Address[];
  };
  