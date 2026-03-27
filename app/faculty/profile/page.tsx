"use client";

import ProfileForm from "../components/ProfileForm";
import { motion } from "framer-motion";

export default function FacultyProfilePage() {
  return (
    <motion.div>
      {/* This calls your component from app/faculty/components/ProfileForm.tsx */}
      <ProfileForm />
    </motion.div>
  );
}