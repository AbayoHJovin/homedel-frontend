/* eslint-disable react/prop-types */
import { Tab } from "@mui/material";

export default function MyTab({ Icon, Name, tabvalue, realTabValue }) {
  return (
    <Tab
      label={
        <span className="flex items-center content-center text-center">
          <Icon className="mr-8" size={30} /> {/* Use the Icon prop as a component */}
          {Name}&nbsp;
        </span>
      }
      sx={{
        bgcolor:
          tabvalue === realTabValue
            ? "bg-[#ebeced] dark:bg-gray-700"
            : "transparent",
        color: "black dark:text-white",
        "&:hover": {
          bgcolor: "bg-[#ebeced] dark:bg-gray-700",
          color: "black dark:text-white",
        },
        my: 3,
        borderRadius: 3,
      }}
    />
  );
}
