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
import { Link } from "react-router";

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
        <motion.div style={{ y: backgroundY }} />

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
                  <Link
                    to="/waste-management/today-history"
                    style={{ textDecoration: "none" }}
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
                  </Link>
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

      {/* CTA Section - Clean White Design */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          bgcolor: "white",
          position: "relative",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                border: `2px solid ${alpha("#67c090", 0.15)}`,
                bgcolor: alpha("#f8fdfa", 0.5),
              }}
            >
              <Typography
                variant={isMobile ? "h3" : "h2"}
                fontWeight="800"
                sx={{
                  mb: 2,
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3rem",
                  },
                  background: "linear-gradient(135deg, #0f4a5b, #67c090)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  fontSize: {
                    xs: "1rem",
                    md: "1.2rem",
                  },
                  lineHeight: 1.8,
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Join thousands of organizations making smarter, more sustainable
                decisions with real-time waste insights.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 4 }}
              >
                <Link
                  to="/waste-management/today-history"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "#0f4a5b",
                      color: "white",
                      fontWeight: "600",
                      px: { xs: 5, md: 6 },
                      py: { xs: 1.5, md: 2 },
                      borderRadius: 2,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      boxShadow: "0 4px 20px rgba(15, 74, 91, 0.25)",
                      "&:hover": {
                        bgcolor: "#0a3a4a",
                        boxShadow: "0 6px 30px rgba(15, 74, 91, 0.35)",
                      },
                      textTransform: "none",
                      minWidth: { xs: "280px", sm: "auto" },
                    }}
                  >
                    Get Started Today
                  </Button>
                </Link>
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "#0f4a5b",
                    color: "#0f4a5b",
                    fontWeight: "600",
                    px: { xs: 5, md: 6 },
                    py: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "#0f4a5b",
                      bgcolor: alpha("#0f4a5b", 0.05),
                    },
                    textTransform: "none",
                    minWidth: { xs: "280px", sm: "auto" },
                  }}
                >
                  Contact Sales
                </Button>
              </Stack>

              {/* Trust Badges */}
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{
                  pt: 3,
                  borderTop: `1px solid ${alpha("#67c090", 0.15)}`,
                }}
              >
                {[
                  { icon: "✓", text: "Free 14-Day Trial" },
                  { icon: "✓", text: "No Credit Card" },
                  { icon: "✓", text: "Cancel Anytime" },
                ].map((item, idx) => (
                  <Grid item key={idx}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "#67c090",
                          color: "white",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer - Clean White Design */}
      <Box
        sx={{
          bgcolor: alpha("#f8fdfa", 0.5),
          py: { xs: 6, md: 8 },
          borderTop: `1px solid ${alpha("#67c090", 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  background: "linear-gradient(135deg, #0f4a5b, #67c090)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                EcoWaste
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  mb: 3,
                  maxWidth: "320px",
                }}
              >
                Revolutionizing waste management through innovative technology
                and sustainable practices for a cleaner planet.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                {[
                  { icon: "🌐", label: "Website" },
                  { icon: "📧", label: "Email" },
                  { icon: "📱", label: "Social" },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    component={motion.div}
                    whileHover={{ scale: 1.1, y: -2 }}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: "white",
                      border: `1px solid ${alpha("#67c090", 0.2)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#67c090",
                        boxShadow: `0 4px 12px ${alpha("#67c090", 0.2)}`,
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "1.2rem" }}>
                      {item.icon}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} md={2}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 2, color: "#0f4a5b" }}
              >
                Product
              </Typography>
              <Stack spacing={1.5}>
                {["Features", "Pricing", "Demo", "Updates"].map((link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#67c090",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 2, color: "#0f4a5b" }}
              >
                Company
              </Typography>
              <Stack spacing={1.5}>
                {["About", "Careers", "Blog", "Contact"].map((link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#67c090",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 2, color: "#0f4a5b" }}
              >
                Stay Updated
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2, lineHeight: 1.6 }}
              >
                Get the latest updates on waste management solutions.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: `1px solid ${alpha("#67c090", 0.2)}`,
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.disabled", fontSize: "0.9rem" }}
                  >
                    Enter your email
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#67c090",
                    minWidth: "auto",
                    px: 3,
                    borderRadius: 2,
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#4a9c7c",
                      boxShadow: "none",
                    },
                  }}
                >
                  →
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Bottom Bar */}
          <Box
            sx={{
              mt: { xs: 6, md: 8 },
              pt: 4,
              borderTop: `1px solid ${alpha("#67c090", 0.1)}`,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              © {new Date().getFullYear()} EcoWaste Technologies. All rights
              reserved.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 3 }}
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#67c090",
                      },
                    }}
                  >
                    {link}
                  </Typography>
                )
              )}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Insight;
