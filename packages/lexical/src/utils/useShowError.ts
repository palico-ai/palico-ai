import { useContext } from "react";
import { toast } from "react-toastify";
import { LexicalAITypeaheadContext } from "../typeahead.context";

interface UseShowErrorParams {
  closeOnError?: boolean; // default: true
  defaultErrorMessage?: string;
}

interface ShowErrorOptions {
  closeOnError?: boolean;
  consoleMessage?: string;
}

export const useShowError = (params: UseShowErrorParams) => {
  const {
    closeOnError = true,
    defaultErrorMessage = "An error occurred"
  } = params
  const { handleClose } = useContext(LexicalAITypeaheadContext);

  const showErrorMessage = (message: string, options?: ShowErrorOptions) => {
    const {
      closeOnError: shouldCloseOnError = closeOnError,
      consoleMessage
    } = options ?? {};
    toast.error(message);
    if(consoleMessage) {
      console.error(consoleMessage);
    }
    if (shouldCloseOnError) {
      handleClose();
    }
  }

  const showError = (error: Error, options?: ShowErrorOptions) => {
    const errorMessage = error.message || defaultErrorMessage;
    showErrorMessage(errorMessage, options);
  }

  return {showError, showErrorMessage};
}