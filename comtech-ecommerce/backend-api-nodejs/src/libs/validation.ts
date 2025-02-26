export const isValidId = (value: any) : boolean => {
  if(isNaN(value)) {
    return false;
  }
  else {
    if(value <= 0 ) {
      return false;
    }
  }

  return true;
}

export const isValidHaveValue = (values: any[]) : boolean => {
  for(let i = 0; i < values.length; i++) {
    if(!values[i]) {
      return false;
    }
  }

  return true;
}