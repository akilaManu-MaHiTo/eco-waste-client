import React from "react";
import { Avatar, Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";

const categoryColors: Record<string, string> = {
  Plastic: "#2196f3",
  Paper: "#ff9800",
  Glass: "#4caf50",
  Metal: "#9c27b0",
  Organic: "#8bc34a",
};

const UserCategoryList = ({ items }: any) => {
  if (!items || items.length === 0) {
    return (
      <Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <CategoryIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            User Category Breakdown
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          No user category data available.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        padding: 3, 
        height: "100%",
        background: "linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)"
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <CategoryIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          User Category Breakdown
        </Typography>
      </Stack>
      
      <Stack spacing={2} divider={<Divider flexItem />}>
        {items.map((it: any, index: number) => {
          const categoryColor = categoryColors[it.category] || "#607d8b";
          
          return (
            <Stack key={`${it.category}-${index}`} spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${categoryColor}15`,
                    color: categoryColor,
                    width: 48,
                    height: 48
                  }}
                >
                  <CategoryIcon />
                </Avatar>
                
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {it.category}
                    </Typography>
                    <Chip 
                      label={`${it.totalWeight} kg`}
                      size="small"
                      sx={{ 
                        bgcolor: `${categoryColor}20`,
                        color: categoryColor,
                        fontWeight: 600,
                        fontSize: "0.75rem"
                      }}
                    />
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        {it.user?.email || it.user?._id || "Unknown User"}
                      </Typography>
                    </Stack>
                    
                    <Typography variant="caption" color="text.secondary">
                      • {it.count} {it.count === 1 ? "deposit" : "deposits"}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default UserCategoryList;
