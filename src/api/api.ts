import axios from "axios";

const API_URL = "http://localhost:3000/employees";

// Define interfaces for Address and Employee
export interface Address {
  id?: number;
  address: string;
  location: string;
  pin: string;
  contact: string;
}

interface Employee {
  id?: number;
  empNo: string;
  organization: string;
  empName: string;
  designation: string;
  email: string;
  addresses: Address[];
}

// API functions with explicit return types
export const getEmployees = (): Promise<{ data: Employee[] }> => {
  return axios.get(API_URL);
};

export const addEmployee = (employee: Employee): Promise<{ data: Employee }> => {
  return axios.post(API_URL, employee);
};

export const deleteEmployee = (id: string): Promise<void> => {
  return axios.delete(`${API_URL}/${id}`);
};

export const getEmployeeById = (id: string): Promise<{ data: Employee }> => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateEmployee = (
  id: string,
  updatedData: Employee
): Promise<{ data: Employee }> => {
  return axios.put(`${API_URL}/${id}`, updatedData);
};