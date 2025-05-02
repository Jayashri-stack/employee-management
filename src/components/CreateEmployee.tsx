import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { addEmployee, Address } from "../api/api";
import AddressTable from "./AddressTable";

// Zod schema for form validation
const employeeSchema = z.object({
  empNo: z.string().min(1, "Employee Number is required"),
  organization: z.string().min(1, "Organization is required"),
  empName: z.string().min(1, "Employee Name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

// Infer TypeScript type from Zod schema
type EmployeeFormValues = z.infer<typeof employeeSchema>;

// Styled container with blue gradient background
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
}));

// Styled card with subtle shadow and rounded corners
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  width: "100%",
  boxShadow: "0 8px 24px rgba(0, 0, 50, 0.1)",
  borderRadius: "16px",
  backgroundColor: "#ffffff",
}));

// Styled button with hover effect
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1e3a8a",
  color: "#ffffff",
  padding: theme.spacing(1, 4),
  borderRadius: "8px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#1e40af",
  },
}));

const CreateEmployee: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const navigate = useNavigate();

  // Formik setup with Zod validation
  const formik = useFormik<EmployeeFormValues>({
    initialValues: {
      empNo: "",
      organization: "",
      empName: "",
      designation: "",
      email: "",
    },
    validationSchema: toFormikValidationSchema(employeeSchema),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      const employeeData = {
        ...values,
        addresses,
      };

      addEmployee(employeeData)
        .then(() => {
          resetForm();
          setAddresses([]);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error adding employee:", error);
        });
    },
  });

  return (
    <PageContainer>
      <StyledCard>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="#1e3a8a"
            textAlign="center"
            gutterBottom
          >
            Create a New Employee
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <TextField
                label="Employee No."
                name="empNo"
                value={formik.values.empNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.empNo && Boolean(formik.errors.empNo)}
                helperText={formik.touched.empNo && formik.errors.empNo}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#1e3a8a",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1e40af",
                    },
                  },
                }}
              />

              <TextField
                label="Organization"
                name="organization"
                value={formik.values.organization}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.organization &&
                  Boolean(formik.errors.organization)
                }
                helperText={
                  formik.touched.organization && formik.errors.organization
                }
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#1e3a8a",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1e40af",
                    },
                  },
                }}
              />

              <TextField
                label="Employee Name"
                name="empName"
                value={formik.values.empName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.empName && Boolean(formik.errors.empName)}
                helperText={formik.touched.empName && formik.errors.empName}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#1e3a8a",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1e40af",
                    },
                  },
                }}
              />

              <TextField
                label="Designation"
                name="designation"
                value={formik.values.designation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.designation &&
                  Boolean(formik.errors.designation)
                }
                helperText={
                  formik.touched.designation && formik.errors.designation
                }
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#1e3a8a",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1e40af",
                    },
                  },
                }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#1e3a8a",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1e40af",
                    },
                  },
                }}
              />

              {/* Address Table Section */}
              <AddressTable
                addresses={addresses}
                setAddresses={setAddresses}
              />

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <StyledButton
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Save Employee
                </StyledButton>
              </Box>
            </Box>
          </form>
        </CardContent>
      </StyledCard>
    </PageContainer>
  );
};

export default CreateEmployee;