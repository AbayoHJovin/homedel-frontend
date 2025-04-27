
import { useContext } from "react";
import { Box, Button, Modal, Typography, Stack } from "@mui/material";
import { ThemeContext } from "@emotion/react";

// eslint-disable-next-line react/prop-types
const LogoutModal = ({ open, handleClose, handleConfirmLogout }) => {
  const { theme } = useContext(ThemeContext); 

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="logout-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "500px", md: "600px" }, 
          bgcolor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "background.paper",
          border: theme === "dark" ? "1px solid #fff" : "none",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          backdropFilter: "blur(10px)",
          color: theme === "dark" ? "#fff" : "#000", 
        }}
      >
        <Typography
          id="logout-modal"
          variant="h5"
          fontWeight="bold"
          textAlign="center"
        >
          Are you sure you want to logout ?
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            mb: 3,
            color: theme === "dark" ? "#bbb" : "#666",
            textAlign: "center",
          }}
        >
          Your liked products and purchase information will be in our database
        </Typography>

        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ mt: 3 }}
          spacing={2}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              width: { xs: "45%", sm: "30%" },
              color: theme === "dark" ? "#fff" : "#000", 
              borderColor: theme === "dark" ? "#fff" : "#000", 
              "&:hover": {
                backgroundColor:
                  theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#f0f0f0", 
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmLogout}
            sx={{
              width: { xs: "45%", sm: "30%" },
              bgcolor: theme === "dark" ? "#ff5757" : "#d32f2f", 
              "&:hover": {
                bgcolor: theme === "dark" ? "#ff3d3d" : "#c62828",
              },
            }}
          >
            Continue
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
