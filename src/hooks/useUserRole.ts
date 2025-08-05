"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export type UserRole = "tutor" | "student" | "observer";

export function useUserRole(): {
  role: UserRole;
  isValidRole: boolean;
  roleDisplayName: string;
  sessionId: string | null;
} {
  const searchParams = useSearchParams();

  const role = useMemo(() => {
    const roleParam = searchParams.get("role")?.toLowerCase();

    if (roleParam === "tutor" || roleParam === "teacher") {
      return "tutor" as UserRole;
    }
    if (roleParam === "student" || roleParam === "learner") {
      return "student" as UserRole;
    }

    // Default to observer if no valid role specified
    return "observer" as UserRole;
  }, [searchParams]);

  const sessionId = useMemo(() => {
    return searchParams.get("session") || searchParams.get("sessionId");
  }, [searchParams]);

  const isValidRole = role !== "observer";

  const roleDisplayName = useMemo(() => {
    switch (role) {
      case "tutor":
        return "Tutor";
      case "student":
        return "Student";
      case "observer":
        return "Observer";
      default:
        return "Unknown";
    }
  }, [role]);

  return {
    role,
    isValidRole,
    roleDisplayName,
    sessionId,
  };
}
