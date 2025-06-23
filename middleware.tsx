import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect unauthorized users to login
  },
});

// Apply middleware only to specific routes
export const config = {
  matcher: [ "/dashboard", "/", "/settings"], // Add protected routes here
};
