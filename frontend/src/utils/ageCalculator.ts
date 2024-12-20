export const calculateAge = (dateOfBirth: string): number => {
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
  
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };