import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClearIcon from "@mui/icons-material/Clear";
// import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { keyframes, styled } from "@mui/system";

// Define animations for spinners
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotateScale = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.8);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

// Define animations for the UI
const slideIn = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px #1976D2;
  }
  50% {
    box-shadow: 0 0 15px #1976D2;
  }
  100% {
    box-shadow: 0 0 5px #1976D2;
  }
`;

// Styled components for spinners
const PulsingDots = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  width: "24px",
  height: "24px",
  "& span": {
    width: "6px",
    height: "6px",
    backgroundColor: "#1976D2",
    borderRadius: "50%",
    display: "inline-block",
    animation: `${pulse} 1.2s infinite ease-in-out`,
  },
  "& span:nth-of-type(2)": {
    animationDelay: "0.4s",
  },
  "& span:nth-of-type(3)": {
    animationDelay: "0.8s",
  },
});

const RotatingSquare = styled("div")({
  width: "16px",
  height: "16px",
  border: "2px solid #00ACC1",
  animation: `${rotateScale} 1s infinite linear`,
});

const BouncingLoader = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  width: "24px",
  height: "24px",
  "& span": {
    width: "6px",
    height: "6px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    display: "inline-block",
    animation: `${bounce} 1.4s infinite ease-in-out`,
  },
  "& span:nth-of-type(2)": {
    animationDelay: "0.2s",
  },
  "& span:nth-of-type(3)": {
    animationDelay: "0.4s",
  },
});

// Employee interface (aligned with api.ts)
interface Address {
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

const EmployeeList = () => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [filteredRows, setFilteredRows] = useState<Employee[]>([]);
  const [organizationList, setOrganizationList] = useState<string[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<number | null>(null);
  const [loadingView, setLoadingView] = useState<number | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get<Employee[]>("http://localhost:3000/employees");
      setRows(response.data);
      setFilteredRows(response.data);
      const uniqueOrgs = Array.from(
        new Set(response.data.map((emp) => emp.organization))
      ) as string[];
      setOrganizationList(uniqueOrgs);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setRows([]);
      setFilteredRows([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle search and organization filtering
  useEffect(() => {
    let filtered = rows;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((emp) =>
        [emp.id?.toString(), emp.empName, emp.email].some((field) =>
          field?.toLowerCase().includes(query)
        )
      );
    }

    // Apply organization filter
    if (selectedOrganization) {
      filtered = filtered.filter((emp) => emp.organization === selectedOrganization);
    }

    setFilteredRows(filtered);
    setPage(0); // Reset to first page when filters change
  }, [searchQuery, selectedOrganization, rows]);

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://localhost:3000/employees/${id}`)
        )
      );
      const updatedRows = rows.filter((row) => !selectedIds.includes(String(row.id)));
      setRows(updatedRows);
      setFilteredRows(updatedRows);
      setSelectedIds([]);
      setOpenConfirmDialog(false);
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  const handleOpenDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEmployeeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await axios.delete(`http://localhost:3000/employees/${employeeToDelete.id}`);
        fetchEmployees();
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleToggleFilter = () => {
    const newShowFilter = !showFilter;
    setShowFilter(newShowFilter);
    if (!newShowFilter) {
      setSelectedOrganization("");
    }
  };

  const handleClear = () => {
    setSelectedOrganization("");
    setSearchQuery("");
  };

  const handleRowSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(
        filteredRows
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row) => String(row.id))
      );
    } else {
      setSelectedIds([]);
    }
  };

  const handleNavigate = (path: string, type: "edit" | "view" | "add", id?: number) => {
    if (type === "edit" && id) {
      setLoadingEdit(id);
    } else if (type === "view" && id) {
      setLoadingView(id);
    } else if (type === "add") {
      setLoadingAdd(true);
    }

    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginate filteredRows
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={4} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card
        sx={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          borderRadius: 3,
          background: "linear-gradient(135deg, #e6f0fa 0%, #d1e2f5 100%)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
          },
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="#1F2937"
            textAlign="center"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Employee Management
          </Typography>

          <Box display="flex" alignItems="center" mb={3} gap={2}>
            <TextField
              label="Search Employees"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontFamily: "'Poppins', sans-serif",
                  "&:hover fieldset": {
                    borderColor: "#1976D2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976D2",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "'Poppins', sans-serif",
                  color: "#6B7280",
                },
              }}
            />
            <Tooltip title={showFilter ? "Hide Filter" : "Show Filter"}>
              <IconButton
                onClick={handleToggleFilter}
                sx={{
                  background: "linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)",
                  color: "#ffffff",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565C0 30%, #2196F3 90%)",
                    animation: `${glow} 1s ease-in-out infinite`,
                  },
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Selected">
              <IconButton
                disabled={selectedIds.length === 0}
                onClick={() => setOpenConfirmDialog(true)}
                sx={{
                  background: "linear-gradient(45deg, #F50057 30%, #FF6E7F 90%)",
                  color: "#ffffff",
                  "&:hover": {
                    background: "linear-gradient(45deg, #D81B60 30%, #FF4D5E 90%)",
                    animation: `${glow} 1s ease-in-out infinite`,
                  },
                  "&:disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Employee">
              <IconButton
                onClick={() => handleNavigate("/create", "add")}
                sx={{
                  background: "linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)",
                  color: "#ffffff",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565C0 30%, #2196F3 90%)",
                    animation: `${glow} 1s ease-in-out infinite`,
                  },
                }}
              >
                {loadingAdd ? (
                  <BouncingLoader>
                    <span></span>
                    <span></span>
                    <span></span>
                  </BouncingLoader>
                ) : (
                  <AddIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          {showFilter && (
            <Box display="flex" alignItems="center" mb={3} gap={2}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  mr: 2,
                  fontFamily: "'Poppins', sans-serif",
                  color: "#1F2937",
                }}
              >
                Organization:
              </Typography>
              <TextField
                select
                size="small"
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                sx={{
                  width: 250,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontFamily: "'Poppins', sans-serif",
                    "&:hover fieldset": {
                      borderColor: "#1976D2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976D2",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "'Poppins', sans-serif",
                    color: "#6B7280",
                  },
                }}
              >
                <MenuItem value="">--Select Organization--</MenuItem>
                {organizationList.map((org) => (
                  <MenuItem key={org} value={org}>
                    {org}
                  </MenuItem>
                ))}
              </TextField>
              <Tooltip title="Clear Filter">
                <IconButton
                  onClick={handleClear}
                  sx={{
                    background: "linear-gradient(45deg, #FF9800 30%, #FFB300 90%)",
                    color: "#ffffff",
                    "&:hover": {
                      background: "linear-gradient(45deg, #F57C00 30%, #FF8F00 90%)",
                      animation: `${glow} 1s ease-in-out infinite`,
                    },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 450,
              background: "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              overflow: "auto",
            }}
          >
            <Table stickyHeader aria-label="employee table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      fontFamily: "'Poppins', sans-serif",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    <Checkbox
                      checked={
                        selectedIds.length === paginatedRows.length &&
                        paginatedRows.length > 0
                      }
                      onChange={handleSelectAll}
                      sx={{ color: "#ffffff", "&.Mui-checked": { color: "#ffffff" } }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      fontFamily: "'Poppins', sans-serif",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Employee No.
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      fontFamily: "'Poppins', sans-serif",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      fontFamily: "'Poppins', sans-serif",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Designation
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      fontFamily: "'Poppins', sans-serif",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      fontFamily: "'Poppins', sans-serif",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Organization
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      fontFamily: "'Poppins', sans-serif",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          color: "#6B7280",
                          padding: "20px",
                        }}
                      >
                        No employees available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#F9FAFB",
                        },
                        "&:nth-of-type(even)": {
                          backgroundColor: "#FFFFFF",
                        },
                        "&:hover": {
                          backgroundColor: "#DBEAFE",
                        },
                        animation: `${slideIn} 0.5s ease-in-out`,
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(String(row.id))}
                          onChange={() => handleRowSelection(String(row.id))}
                          sx={{ color: "#1976D2", "&.Mui-checked": { color: "#1976D2" } }}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {row.empNo}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {row.empName}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {row.designation}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {row.email}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {row.organization}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleNavigate(`/edit/${row.id}`, "edit", row.id)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#e3f2fd",
                                transform: "scale(1.1)",
                              },
                              transition: "transform 0.2s ease-in-out",
                            }}
                          >
                            {loadingEdit === row.id ? (
                              <PulsingDots>
                                <span></span>
                                <span></span>
                                <span></span>
                              </PulsingDots>
                            ) : (
                              <EditIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleNavigate(`/view/${row.id}`, "view", row.id)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#e0f7fa",
                                transform: "scale(1.1)",
                              },
                              transition: "transform 0.2s ease-in-out",
                            }}
                          >
                            {loadingView === row.id ? (
                              <RotatingSquare />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteDialog(row)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#ffebee",
                                transform: "scale(1.1)",
                              },
                              transition: "transform 0.2s ease-in-out",
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              "& .MuiTablePagination-toolbar": {
                fontFamily: "'Poppins', sans-serif",
                color: "#1F2937",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontFamily: "'Poppins', sans-serif",
                color: "#1F2937",
              },
              "& .MuiTablePagination-actions button": {
                color: "#1976D2",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "bold",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Are you sure you want to delete {selectedIds.length} selected{" "}
            {selectedIds.length > 1 ? "records" : "record"}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            sx={{
              color: "#F50057",
              borderRadius: 2,
              fontFamily: "'Poppins', sans-serif",
              "&:hover": {
                backgroundColor: "#fce7f3",
              },
            }}
          >
            No
          </Button>
          <Button
            onClick={handleDeleteSelected}
            sx={{
              background: "linear-gradient(45deg, #F50057 30%, #FF6E7F 90%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(45deg, #D81B60 30%, #FF4D5E 90%)",
                animation: `${glow} 1s ease-in-out infinite`,
              },
              borderRadius: 2,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "bold",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Are you sure you want to delete {employeeToDelete?.empName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: "#F50057",
              borderRadius: 2,
              fontFamily: "'Poppins', sans-serif",
              "&:hover": {
                backgroundColor: "#fce7f3",
              },
            }}
          >
            No
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              background: "linear-gradient(45deg, #F50057 30%, #FF6E7F 90%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(45deg, #D81B60 30%, #FF4D5E 90%)",
                animation: `${glow} 1s ease-in-out infinite`,
              },
              borderRadius: 2,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeList;