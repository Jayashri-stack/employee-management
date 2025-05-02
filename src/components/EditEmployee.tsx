import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEmployeeById, updateEmployee } from "../api/api";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import AddressTable from "./AddressTable";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      getEmployeeById(id).then((res) => {
        setEmployee(res.data);
        setAddresses(res.data.addresses);
      });
    }
  }, [id]);

  const handleUpdate = () => {
    if (!id) return;

    updateEmployee(id, { ...employee, addresses })
      .then(() => navigate("/"))
      .catch((err) => console.error("Error updating employee", err));
  };

  if (!employee) return <Typography>Loading employee...</Typography>;

  return (
    <Box p={4} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card sx={{ maxWidth: 800, margin: "auto", boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="text.primary"
            textAlign="center"
          >
            Edit Employee
          </Typography>
          <Box display="flex" flexDirection="column" gap={3} mt={3}>
            <TextField
              label="Employee No."
              value={employee.empNo}
              onChange={(e) => setEmployee({ ...employee, empNo: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Organization"
              value={employee.organization}
              onChange={(e) =>
                setEmployee({ ...employee, organization: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Employee Name"
              value={employee.empName}
              onChange={(e) =>
                setEmployee({ ...employee, empName: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Designation"
              value={employee.designation}
              onChange={(e) =>
                setEmployee({ ...employee, designation: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Email"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <AddressTable addresses={addresses} setAddresses={setAddresses} />

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                sx={{
                  backgroundColor: "#1976D2",
                  "&:hover": { backgroundColor: "#1565C0" },
                  borderRadius: 2,
                  padding: "10px 20px",
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditEmployee;