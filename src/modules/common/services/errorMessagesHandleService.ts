type ErrorMessageData = {
  message: string
  field: string
}

export type ErrorMessageHandleResult = { errorMessages: ErrorMessageData[] }

export const errorMessagesHandleService = (errorMessageData: ErrorMessageData): ErrorMessageHandleResult => {
  return {
    errorMessages: [
      {
        message: errorMessageData.message,
        field: errorMessageData.field,
      },
    ],
  }
}
