import { useMemo, useState } from "react";
import { useSession } from "./useSession";

export function useEmployeeScope() {
  const { isAdmin, myEmployeeId } = useSession();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");

  const effectiveEmployeeId = useMemo<number | null>(() => {
    if (isAdmin) {
      return typeof selectedEmployeeId === "number" ? selectedEmployeeId : null;
    }
    return myEmployeeId;
  }, [isAdmin, selectedEmployeeId, myEmployeeId]);

  const canShowAll = isAdmin && effectiveEmployeeId == null;
  const shouldShowNone = !isAdmin && effectiveEmployeeId == null;

  return {
    selectedEmployeeId,
    setSelectedEmployeeId,
    effectiveEmployeeId,
    canShowAll,
    shouldShowNone,
  };
}
