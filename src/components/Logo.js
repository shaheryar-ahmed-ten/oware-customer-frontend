import owareLogo from '../assets/logo/owareLogo.png'
import axios from 'axios';
import { getURL } from '../utils/common';
import { useEffect, useState } from 'react';

export default function Logo({ variant }) {
  
  const [filelocation, setFileLocation] = useState(null);
  useEffect(() => {
    getRelations();
}, []);

  const getRelations = e => {
    // e.preventDefault();
    axios.get(getURL('/user/company'))
    .then((res) => {
      console.log(res.data);
      setFileLocation(res.data.file.id);
      // console.log(filelocation)
  })
  }
  const Logo = getURL('/preview/',filelocation) ? getURL('/preview/',filelocation) : owareLogo;
  return (
    <a href = "/dashboard" ><img src={owareLogo} alt="oware logo" /></a>
  );
};
