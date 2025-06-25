import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin", // Redirect unauthorized users to login
  },
});

// Apply middleware only to specific routes
export const config = {
  matcher: [ "settings", "/liquid", "/"], // Add protected routes here
};
