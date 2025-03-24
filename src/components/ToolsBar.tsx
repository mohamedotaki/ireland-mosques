import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { Avatar, Card, Container, IconButton, Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function ToolsBar() {
  return (
    <Card sx={{ display: "flex", flexDirection: "row", py: 2, aspectRatio: 1, maxHeight: 100, width: "100%" }}>

      <IconButton sx={{ flexDirection: "column", }}>
        <Avatar src="/static/images/avatar/2.jpg" >
          <AttachMoneyIcon /> </Avatar>
        <Typography>zakat</Typography>
      </IconButton>


    </Card>
  );
}
