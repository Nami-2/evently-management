import React from 'react'

import { FcGoogle } from "react-icons/fc";  
import { Button } from "@/components/ui/button";

export const Social = () => {  
  const handleGoogleSignIn = () => {  
    // Logic for Google sign-in  
    console.log("Google sign-in initiated");  
  };  

  return (  
    <div className="flex items-center w-full gap-x-2">  
      <Button  
        size="lg"  
        className="w-full"  
        variant="outline"  
        onClick={handleGoogleSignIn}  
      >  
        <FcGoogle className="h-5 w-5"/>  
      </Button>  
    </div>  
  );  
};