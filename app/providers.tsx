  "use client";

  import { GoogleOAuthProvider } from "@react-oauth/google";

  export default function Providers({
    children,
  }: {  
    children: React.ReactNode;
  }) {
    return (
      <GoogleOAuthProvider
        clientId={"72884298047-g36av4a4ailackp1989nqtjb4taqafo4.apps.googleusercontent.com"}
      >
        {children}
      </GoogleOAuthProvider>
    );
  }
