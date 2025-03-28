
import { useToast as useHookToast, toast as hookToast } from "@/hooks/use-toast";

// Re-export with the same names to maintain compatibility
export const useToast = useHookToast;
export const toast = hookToast;
