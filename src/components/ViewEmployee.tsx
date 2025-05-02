import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEmployeeById } from "../api/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      getEmployeeById(id).then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setEmployees(data);
      });
    }
  }, [id]);

  if (!employees.length)
    return (
      <Box
        p={4}
        sx={{
          backgroundColor: "#e3f2fd",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="primary">
          Loading employee details...
        </Typography>
      </Box>
    );

  return (
    <Box p={4} sx={{ backgroundColor: "#e3f2fd", minHeight: "100vh" }}>
      {employees.map((employee, index) => (
        <Box key={index} mb={4}>
          {/* Employee Details Card */}
          <Card
            sx={{
              maxWidth: 800,
              margin: "auto",
              boxShadow: 5,
              borderRadius: 3,
              border: "1px solid #90caf9",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                color="primary"
                textAlign="center"
              >
                {employee.empNo} - {employee.empName}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box mt={2}>
                {[
                  { label: "Organization", value: employee.organization },
                  { label: "Designation", value: employee.designation },
                  { label: "Email", value: employee.email },
                ].map((item, idx) => (
                  <Typography
                    key={idx}
                    variant="body1"
                    fontWeight="bold"
                    color="text.primary"
                    mt={idx === 0 ? 0 : 1.5}
                  >
                    {item.label}:
                    <Typography component="span" fontWeight="normal" ml={1}>
                      {item.value}
                    </Typography>
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Address Details Card */}
          <Card
            sx={{
              maxWidth: 800,
              margin: "20px auto 0",
              boxShadow: 5,
              borderRadius: 3,
              border: "1px solid #90caf9",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                color="primary"
                textAlign="left"
              >
                Address Details
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {employee.addresses?.length ? (
                <List>
                  {employee.addresses.map((addr: any) => (
                    <ListItem
                      key={addr.id}
                      sx={{ py: 1.5, borderBottom: "1px solid #e0e0e0" }}
                    >
                      <ListItemText
                        primary={`${addr.address}, ${addr.location}`}
                        secondary={`Pin: ${addr.pin}, Contact: ${addr.contact}`}
                        primaryTypographyProps={{ fontWeight: "bold", color: "text.primary" }}
                        secondaryTypographyProps={{ color: "text.secondary" }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No address details available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default ViewEmployee;
