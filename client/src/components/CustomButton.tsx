import React from "react";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

const StyledButton = styled(Button)({
  textTransform: "none",
  fontFamily: "inherit",
});

const CustomButton: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props} />;
};

export default CustomButton;
