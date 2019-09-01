export type Errors = {
  [field: string]: Array<string>
}

export const parseErrors = (response: any): Errors => {
  if(response && response.response && response.response.errors) {
    return response.response.errors
  }

  return {}
}