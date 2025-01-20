"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  // Check if user is logged in
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if user has an id
  if (!user.id) {
    return { error: "Unauthorized" };
  }

  // Get user from database
  const dbUser = await getUserById(user.id);

  // Check if user exists in database
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  // Check if email is provided and is different from the current email
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email); // Generate verification token

    // Send verification email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent!" };
  }

  // Check if password is provided and is different from the current password 
  if (values.password && values.newPassword && dbUser.password) {  

    // Check if passwords match 
    const passwordsMatch = await bcrypt.compare(  
      values.password,  
      dbUser.password,  
    );  
  
    // Check if passwords match 
    if (!passwordsMatch) {  
      return { error: "Incorrect password!" };  
    }  
  
    // Hash new password 
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);  
    values.password = hashedPassword; 
    values.newPassword = undefined; 
  }

  // Update user settings
  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  });

  // Return success message
  return { success: "Settings Updated!" };
};
