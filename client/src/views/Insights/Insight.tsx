import {
  Box,
  Stack,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import insightImage from "../../assets/insight-bg.png";
import dashboardImg from "../../assets/garbage-img-02.png";

// Glass morphism effect
const glassStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

function Insight() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      title: "Real-Time Monitoring",
      desc: "Track waste levels of bins instantly with IoT-enabled devices.",
      icon: "🌐",
      color: "#67c090",
    },
    {
      title: "Smart Alerts",
      desc: "Get notified when bins are full or reach threshold levels.",
      icon: "🔔",
      color: "#4a9c7c",
    },
    {
      title: "Reports & Insights",
      desc: "Visualize waste data and make data-driven decisions.",
      icon: "📊",
      color: "#0f4a5b",
    },
  ];

  const stats = [
    { value: "85%", label: "Cost Reduction" },
    { value: "24/7", label: "Monitoring" },
    { value: "99%", label: "Accuracy" },
    { value: "50%", label: "Efficiency Gain" },
  ];

  return (
    <Box ref={containerRef} sx={{ width: "100%", minHeight: "100vh" }}>
      {/* Hero Section - Modern Design */}
      <Box
        sx={{
          minHeight: { xs: "90vh", md: "100vh" },
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Elements */}
        <motion.div
          style={{ y: backgroundY }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? "h3" : isTablet ? "h2" : "h1"}
                  fontWeight="800"
                  sx={{
                    color: "transparent",
                    mb: { xs: 2, md: 3 },
                    lineHeight: { xs: 1.3, md: 1.2 },
                    background:
                      "linear-gradient(135deg, #0f4a5b 0%, #67c090 50%, #0f4a5b 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    textAlign: { xs: "center", md: "left" },
                    fontSize: {
                      xs: "2.5rem",
                      sm: "3rem",
                      md: "3.75rem",
                      lg: "4.5rem",
                    },
                  }}
                >
                  Smart Waste Management
                </Typography>
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{
                    color: alpha("#1b7a47ff", 0.9),
                    mb: { xs: 3, md: 4 },
                    lineHeight: 1.6,
                    textAlign: { xs: "center", md: "left" },
                    fontSize: {
                      xs: "1rem",
                      md: "1.25rem",
                    },
                  }}
                >
                  Transform your waste management with AI-powered insights,
                  real-time monitoring, and sustainable solutions for a cleaner
                  future.
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  alignItems="center"
                >
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      bgcolor: "white",
                      color: "#0f4a5b",
                      fontWeight: "bold",
                      px: { xs: 3, md: 4 },
                      py: { xs: 1, md: 1.5 },
                      borderRadius: 2,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      width: { xs: "100%", sm: "auto" },
                      maxWidth: { xs: "280px", sm: "none" },
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      fontWeight: "bold",
                      px: { xs: 3, md: 4 },
                      py: { xs: 1, md: 1.5 },
                      borderRadius: 2,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: alpha("#fff", 0.1),
                      },
                      width: { xs: "100%", sm: "auto" },
                      maxWidth: { xs: "280px", sm: "none" },
                    }}
                  >
                    View Demo
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src={dashboardImg}
                  alt="Dashboard Preview"
                  sx={{
                    width: "100%",
                    maxWidth: {
                      xs: "300px",
                      sm: "400px",
                      md: "500px",
                      lg: "600px",
                    },
                    height: "auto",
                    display: "block",
                    mx: "auto",
                    mt: { xs: 4, md: 0 },
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#f8fdfa" }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      textAlign: "center",
                      bgcolor: "transparent",
                      boxShadow: "none",
                      border: "1px solid",
                      borderColor: alpha("#67c090", 0.2),
                      borderRadius: { xs: 2, md: 3 },
                      py: { xs: 2, md: 3 },
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                      <Typography
                        variant={isMobile ? "h4" : "h3"}
                        fontWeight="bold"
                        sx={{
                          background:
                            "linear-gradient(45deg, #0f4a5b, #67c090)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                          mb: 1,
                          fontSize: {
                            xs: "2rem",
                            sm: "2.5rem",
                            md: "3rem",
                          },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant={isMobile ? "body2" : "body1"}
                        sx={{
                          color: "#0f4a5b",
                          fontWeight: "500",
                          fontSize: {
                            xs: "0.875rem",
                            sm: "1rem",
                          },
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section - Modern Cards */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant={isMobile ? "h3" : "h2"}
              fontWeight="800"
              textAlign="center"
              sx={{
                background: "linear-gradient(45deg, #0f4a5b, #67c090)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 2,
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                },
              }}
            >
              Why Choose EcoWaste?
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              textAlign="center"
              sx={{
                color: "text.secondary",
                mb: { xs: 6, md: 8 },
                maxWidth: "600px",
                mx: "auto",
                fontSize: {
                  xs: "1rem",
                  md: "1.25rem",
                },
              }}
            >
              Innovative features designed to revolutionize waste management
            </Typography>
          </motion.div>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: isMobile ? 0 : -8 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      border: "none",
                      borderRadius: { xs: 2, md: 3 },
                      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      background: `linear-gradient(135deg, ${alpha(
                        feature.color,
                        0.05
                      )} 0%, ${alpha("#ffffff", 0.1)} 100%)`,
                      "&:hover": {
                        boxShadow: isMobile
                          ? "0 10px 40px rgba(0,0,0,0.08)"
                          : "0 20px 60px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 3, md: 4 },
                        textAlign: "center",
                        "&:last-child": {
                          pb: { xs: 3, md: 4 },
                        },
                      }}
                    >
                      <motion.div
                        whileHover={{
                          scale: isMobile ? 1 : 1.1,
                          rotate: isMobile ? 0 : 5,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Box
                          sx={{
                            fontSize: { xs: "2.5rem", md: "3.5rem" },
                            mb: { xs: 2, md: 3 },
                            display: "inline-block",
                          }}
                        >
                          {feature.icon}
                        </Box>
                      </motion.div>
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        fontWeight="700"
                        gutterBottom
                        sx={{
                          color: feature.color,
                          mb: { xs: 1, md: 2 },
                          fontSize: {
                            xs: "1.25rem",
                            md: "1.5rem",
                          },
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.7,
                          fontSize: {
                            xs: "0.9rem",
                            md: "1rem",
                          },
                        }}
                      >
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#67c090", color: "white" }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant={isMobile ? "h3" : "h2"}
              fontWeight="800"
              textAlign="center"
              sx={{
                mb: 3,
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                },
              }}
            >
              Ready to Transform Your Waste Management?
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              textAlign="center"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: {
                  xs: "1rem",
                  md: "1.25rem",
                },
              }}
            >
              Join thousands of organizations already saving time and money with
              EcoWaste
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                sx={{
                  bgcolor: "white",
                  color: "#0f4a5b",
                  fontWeight: "bold",
                  px: { xs: 4, md: 6 },
                  py: { xs: 1, md: 1.5 },
                  borderRadius: 2,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "280px", sm: "none" },
                }}
              >
                Get Started Today
              </Button>
              <Button
                variant="outlined"
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderColor: "white",
                  color: "white",
                  fontWeight: "bold",
                  px: { xs: 4, md: 6 },
                  py: { xs: 1, md: 1.5 },
                  borderRadius: 2,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.1),
                  },
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "280px", sm: "none" },
                }}
              >
                Contact Sales
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#0a3a4a", color: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                EcoWaste
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.8, maxWidth: "400px" }}
              >
                Revolutionizing waste management through innovative technology
                and sustainable practices for a cleaner planet.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                textAlign={{ xs: "left", md: "right" }}
                sx={{
                  opacity: 0.6,
                  mt: { xs: 2, md: 0 },
                }}
              >
                © {new Date().getFullYear()} EcoWaste Technologies. All rights
                reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Insight;
