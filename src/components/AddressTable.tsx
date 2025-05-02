import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import {
  Button,
  IconButton,
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { z } from "zod";
import { Address } from "../types/types";

type Props = {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
};

// Zod schema for Address validation
const AddressSchema = z.object({
  address: z
    .string()
    .min(1, "Address is required")
    .max(100, "Address must be 100 characters or less"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(50, "Location must be 50 characters or less"),
  pin: z
    .string()
    .min(1, "Pin is required")
    .regex(/^\d{6}$/, "Pin must be exactly 6 digits"),
  contact: z
    .string()
    .min(1, "Contact number is required")
    .regex(/^\d{10}$/, "Contact must be exactly 10 digits"),
});

type FormValues = Omit<Address, "id">;
type FormErrors = Partial<Record<keyof FormValues, string>>;

const AddressTable: React.FC<Props> = ({ addresses, setAddresses }) => {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    address: "",
    location: "",
    pin: "",
    contact: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [editId, setEditId] = useState<number | null>(null); // Track address being edited

  const validateForm = (): boolean => {
    const result = AddressSchema.safeParse(formValues);
    if (result.success) {
      setFormErrors({});
      return true;
    }
    const errors: FormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof FormValues;
      errors[field] = issue.message;
    });
    setFormErrors(errors);
    return false;
  };

  const handleAddOrEdit = () => {
    if (validateForm()) {
      if (editId !== null) {
        // Update existing address
        setAddresses(
          addresses.map((addr) =>
            addr.id === editId ? { id: editId, ...formValues } : addr
          )
        );
      } else {
        // Add new address
        setAddresses([...addresses, { id: Date.now(), ...formValues }]);
      }
      setOpen(false);
      setFormValues({ address: "", location: "", pin: "", contact: "" });
      setEditId(null);
    }
  };

  const handleEdit = (address: Address) => {
    setEditId(address.id!);
    setFormValues({
      address: address.address,
      location: address.location,
      pin: address.pin,
      contact: address.contact,
    });
    setFormErrors({});
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter((row) => row.id !== id));
  };

  const columns: GridColDef[] = [
    {
      field: "address",
      headerName: "Address",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "location",
      headerName: "Location",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    { field: "pin", headerName: "Pin", width: 120, headerAlign: "center", align: "center" },
    {
      field: "contact",
      headerName: "Contact No",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            sx={{ "&:hover": { backgroundColor: "#e3f2fd" } }}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            sx={{ "&:hover": { backgroundColor: "#ffebee" } }}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  return (
    <Box mt={3}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Address List
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditId(null);
                setFormValues({ address: "", location: "", pin: "", contact: "" });
                setFormErrors({});
                setOpen(true);
              }}
              sx={{
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#388E3C" },
                borderRadius: 2,
              }}
            >
              Add Address
            </Button>
          </Box>
          <Box sx={{ height: 350, backgroundColor: "#fff", borderRadius: 2 }}>
            <DataGrid
              rows={addresses}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#1976D2",
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  minHeight: "56px !important",
                  borderBottom: "2px solid #e0e0e0",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#1976D2",
                  color: "#ffffff",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                  color: "#ffffff",
                  fontSize: "1rem",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#e3f2fd",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #e0e0e0",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #e0e0e0",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#1976D2", color: "#fff" }}>
          {editId !== null ? "Edit Address" : "Add New Address"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Address"
              value={formValues.address}
              onChange={(e) =>
                setFormValues({ ...formValues, address: e.target.value })
              }
              fullWidth
              variant="outlined"
              error={!!formErrors.address}
              helperText={formErrors.address}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Location"
              value={formValues.location}
              onChange={(e) =>
                setFormValues({ ...formValues, location: e.target.value })
              }
              fullWidth
              variant="outlined"
              error={!!formErrors.location}
              helperText={formErrors.location}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Pin"
              value={formValues.pin}
              onChange={(e) =>
                setFormValues({ ...formValues, pin: e.target.value })
              }
              fullWidth
              variant="outlined"
              error={!!formErrors.pin}
              helperText={formErrors.pin}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Contact No"
              value={formValues.contact}
              onChange={(e) =>
                setFormValues({ ...formValues, contact: e.target.value })
              }
              fullWidth
              variant="outlined"
              error={!!formErrors.contact}
              helperText={formErrors.contact}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setFormErrors({});
              setFormValues({ address: "", location: "", pin: "", contact: "" });
              setEditId(null);
            }}
            sx={{ color: "#F50057", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddOrEdit}
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#388E3C" },
              borderRadius: 2,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressTable;