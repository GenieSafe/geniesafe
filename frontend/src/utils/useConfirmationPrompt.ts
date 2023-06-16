import { useEffect } from "react";

const useConfirmationPrompt = (isEnabled: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isEnabled) {
        event.preventDefault();
        event.returnValue = ""; // Display the confirmation prompt message
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEnabled]);
};

export default useConfirmationPrompt;
