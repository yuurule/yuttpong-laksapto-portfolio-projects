import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function IndexPage() {

  const { userRole } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  useEffect(() => {

    // if(user?.role === 'HR') {
    //   navigate('/hrm/job-applicants');
    // }
    // else if(user?.role === 'APPLICANT') {
    //   navigate('/hrm/job-applicant-form');
    // }

    navigate('/dashboard');
  }, []);

  return null;
}